import {
  Bell,
  Search,
  MoreHorizontal,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { logout } from "../../store/authSlice.js";

export default function TopNavbar({ title, subtitle }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const menuRef = useRef(null);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch {
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpenMenu(false);
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TV";

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[#1e2c27] bg-[#0b1110]/95 px-6 text-[#e8f0ec] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-5">
        <div className="min-w-0">
          <h2 className="truncate text-[18px] font-extrabold tracking-[-0.3px]">
            {title}
          </h2>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-[#7f8b85]">
            {subtitle}
          </p>
        </div>

        <div className="hidden flex-1 justify-center lg:flex">
          <div className="flex w-full max-w-[420px] items-center gap-3 rounded-[12px] border border-[#27332f] bg-[#111917] px-4 py-2.5">
            <Search size={17} strokeWidth={2.2} className="text-[#7f8b85]" />
            <input
              type="text"
              placeholder="Search documents, reports..."
              className="w-full bg-transparent text-[13px] font-semibold outline-none placeholder:text-[#4a5550]"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setOpenNotifications((prev) => !prev)}
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-[#27332f] bg-[#111917]"
            >
              <Bell size={18} />

              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#19b985] px-1 text-[10px] font-black text-[#07100d]">
                  {notifications.length}
                </span>
              )}
            </button>

            {openNotifications && (
              <div className="absolute right-0 top-14 z-50 w-[360px] rounded-3xl border border-[#27332f] bg-[#111917] p-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black">Notifications</h3>
                  <span className="rounded-full bg-[#19b98518] px-2 py-1 text-[10px] font-black text-[#19b985]">
                    {notifications.length}
                  </span>
                </div>

                <div className="mt-4 max-h-[350px] space-y-3 overflow-y-auto pr-2">
                  {notifications.length === 0 ? (
                    <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-4">
                      <p className="text-sm text-[#7f8b85]">
                        No notifications right now.
                      </p>
                    </div>
                  ) : (
                    notifications.map((item, index) => (
                      <NotificationItem
                        key={`${item.title}-${index}`}
                        title={item.title}
                        text={item.message}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#e9ddff] text-[12px] font-extrabold text-[#4a2a88]">
            {initials}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[11px] border border-[#27332f] bg-[#111917] text-[#b8c2bc] transition hover:bg-[#141d1a] hover:text-[#e8f0ec]"
            >
              <MoreHorizontal size={18} strokeWidth={2.2} />
            </button>

            {openMenu && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-3xl border border-[#27332f] bg-[#111917] p-3 shadow-2xl">
                <MenuItem
                  icon={<Settings size={16} />}
                  title="Settings"
                  subtitle="Manage account preferences"
                  onClick={() => {
                    setOpenMenu(false);
                    window.dispatchEvent(
                      new CustomEvent("taxwise:navigate", {
                        detail: "settings",
                      })
                    );
                  }}
                />

                <MenuItem
                  icon={<CircleHelp size={16} />}
                  title="Help & Support"
                  subtitle="Open support center"
                  onClick={() => {
                    setOpenMenu(false);
                    window.dispatchEvent(
                      new CustomEvent("taxwise:navigate", {
                        detail: "support",
                      })
                    );
                  }}
                />

                <div className="my-2 border-t border-[#27332f]" />

                <MenuItem
                  danger
                  icon={<LogOut size={16} />}
                  title="Logout"
                  subtitle="Sign out current account"
                  onClick={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ title, text }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-4">
      <p className="text-sm font-extrabold text-[#e8f0ec]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#7f8b85]">{text}</p>
    </div>
  );
}

function MenuItem({ icon, title, subtitle, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-[#141d1a]"
    >
      <div
        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-500/10 text-red-400"
            : "bg-[#1a2622] text-[#19b985]"
        }`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`text-sm font-extrabold ${
            danger ? "text-red-400" : "text-[#e8f0ec]"
          }`}
        >
          {title}
        </p>
        <p className="m t-1 text-xs text-[#7f8b85]">{subtitle}</p>
      </div>
    </button>
  );
}