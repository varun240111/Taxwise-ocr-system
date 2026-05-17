import { useState } from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Calculator,
  Lightbulb,
  FolderOpen,
  FileText,
  User,
  Settings,
  ShieldCheck,
  ChevronLeft,
  LogOut,
  Info,
  ReceiptText,
} from "lucide-react";

const sections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
      { label: "Upload salary slip", icon: UploadCloud, page: "upload" },
      { label: "Tax calculator", icon: Calculator, page: "calculator" },
      { label: "Salary records", icon: ReceiptText, page: "salaryRecords" },
      { label: "My tax plan", icon: Lightbulb, page: "plan", badge: "ML" },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "My documents", icon: FolderOpen, page: "documents", count: 4 },
      { label: "HR report", icon: FileText, page: "hr" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My profile", icon: User, page: "profile" },
      { label: "Settings", icon: Settings, page: "settings" },
    ],
  },
];

export default function Sidebar({ activePage, setActivePage, user }) {
  const [collapsed, setCollapsed] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TV";

  return (
    <aside
      className={`relative hidden h-screen shrink-0 overflow-hidden border-r border-[#1e2c27] bg-[#0b1110] text-[#e8f0ec] transition-all duration-300 lg:flex ${
        collapsed ? "w-[74px]" : "w-[260px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_180px_180px_at_0%_0%,#19b98514_0%,transparent_70%),radial-gradient(ellipse_160px_200px_at_100%_100%,#c9933a0d_0%,transparent_70%)]" />

      <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden">
        {/* TOP FIXED */}
        <div className="shrink-0">
          <div className="flex h-[70px] items-center gap-3 border-b border-[#1e2c27] px-[18px]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#19b985] to-[#c9933a] text-[#07100d] shadow-[0_4px_12px_#19b98530]">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-[16px] font-extrabold tracking-[-0.3px]">
                  TaxWise <span className="text-[#c9933a]">Vault</span>
                </h1>
                <p className="truncate text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-[#7f8b85]">
                  Tax Planning
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#27332f] bg-[#111917] text-[#c9933a] transition hover:bg-[#17211e]"
            >
              <ChevronLeft
                size={14}
                strokeWidth={2.5}
                className={`transition duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {!collapsed && (
            <div className="mx-[14px] mt-3 rounded-xl border border-[#27332f] bg-[#111917] px-[14px] py-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wide text-[#7f8b85]">
                  Profile setup
                </span>
                <span className="rounded-full bg-[#c9933a22] px-2 py-0.5 text-[10px] font-extrabold text-[#c9933a]">
                  0%
                </span>
              </div>

              <p className="mb-2 text-[12.5px] font-bold text-[#e8f0ec]">
                Not completed
              </p>

              <div className="h-[3px] overflow-hidden rounded-full bg-[#27332f]">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#19b985] to-[#c9933a]" />
              </div>

              <div className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-4 text-[#7f8b85]">
                <Info size={11} strokeWidth={2.5} className="mt-0.5 shrink-0" />
                <span>Complete profile to unlock tax insights</span>
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE NAV - FLEXIBLE, NO VISIBLE SCROLLBAR */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <div key={section.title} className="mb-3">
              {!collapsed && (
                <div className="mb-1 px-1.5">
                  <p className="pl-0.5 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#4a5550]">
                    {section.title}
                  </p>
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.page;

                  return (
                    <button
                      key={item.page}
                      type="button"
                      onClick={() => setActivePage(item.page)}
                      className={`group relative flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left transition-all duration-150 ${
                        active
                          ? "border border-[#19b98518] bg-[#1a2421]"
                          : "border border-transparent hover:bg-[#141d1a]"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r bg-[#19b985]" />
                      )}

                      <div
                        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] transition ${
                          active
                            ? "bg-[#19b985] text-[#07100d]"
                            : "bg-[#19221f] text-[#c9933a]"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2.2} />
                      </div>

                      {!collapsed && (
                        <>
                          <span
                            className={`min-w-0 flex-1 truncate text-[13px] ${
                              active
                                ? "font-bold text-white"
                                : "font-semibold text-[#b8c2bc] group-hover:text-[#e8f0ec]"
                            }`}
                          >
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="rounded-full bg-[#fff1df] px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-[#7a3e00]">
                              {item.badge}
                            </span>
                          )}

                          {item.count !== undefined && (
                            <span className="rounded-full bg-[#19b98518] px-2 py-0.5 text-[10px] font-bold text-[#19b985]">
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* BOTTOM FIXED */}
        <div className="shrink-0 border-t border-[#1e2c27] bg-[#0b1110] px-[14px] py-3">
          <div
            className={`mb-2 flex items-center gap-2.5 rounded-[11px] border border-[#27332f] bg-[#111917] px-3 py-2.5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#e9ddff] text-xs font-extrabold text-[#4a2a88]">
              {initials}
            </div>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#e8f0ec]">
                    {user?.name || "TaxWise User"}
                  </p>
                  <p className="truncate text-[11px] text-[#7f8b85]">
                    {user?.email || "secure account"}
                  </p>
                </div>

                <div
                  className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#19b985]"
                  title="Online"
                />
              </>
            )}
          </div>

          <button
            type="button"
            className={`flex w-full cursor-pointer items-center rounded-[10px] px-3 py-[9px] text-[13px] font-semibold text-[#9da89d] transition hover:bg-red-500/10 hover:text-[#e05252] ${
              collapsed ? "justify-center" : "gap-2.5"
            }`}
          >
            <LogOut size={16} strokeWidth={2.2} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}