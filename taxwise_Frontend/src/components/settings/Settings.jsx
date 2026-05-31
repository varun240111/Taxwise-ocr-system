import { useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  ShieldCheck,
  Bell,
  Camera,
  Lock,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import api from "../../services/api.js";
import { setCredentials } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";

export default function Settings() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("profile");

  const [notifications, setNotifications] = useState({
  taxReminder: user?.notifications?.taxReminder ?? true,
  proofReminder: user?.notifications?.proofReminder ?? true,
  hrReminder: user?.notifications?.hrReminder ?? true,
});

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TV";

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="mb-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
            <ShieldCheck size={14} />
            Account & Security
          </p>

          <h1 className="mt-5 text-4xl font-black">Settings</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f8b85]">
            Manage your profile, security and notification preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-[#27332f] bg-[#111917] p-4">
            <SettingsTab
              active={activeTab === "profile"}
              icon={User}
              title="My Profile"
              text="Account information"
              onClick={() => setActiveTab("profile")}
            />

            <SettingsTab
              active={activeTab === "security"}
              icon={ShieldCheck}
              title="Security"
              text="Password and protection"
              onClick={() => setActiveTab("security")}
            />

            <SettingsTab
              active={activeTab === "notifications"}
              icon={Bell}
              title="Notifications"
              text="Reminder settings"
              onClick={() => setActiveTab("notifications")}
            />
          </aside>

          <main className="rounded-3xl border border-[#27332f] bg-[#111917] p-6">
            {activeTab === "profile" && (
              <ProfileSection user={user} initials={initials} />
            )}

            {activeTab === "security" && <SecuritySection />}

            {activeTab === "notifications" && (
              <NotificationsSection
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function NotificationsSection({ notifications, setNotifications }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [saving, setSaving] = useState(false);

  const update = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);

      const res = await api.put("/auth/notifications", {
        notifications,
      });

      dispatch(
        setCredentials({
          token,
          user: res.data.user,
        })
      );

      alert("Notifications saved successfully");
    } catch {
      alert("Failed to save notifications");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        icon={Bell}
        title="Notifications"
        text="Control reminders for tax planning and HR declaration."
      />

      <div className="mt-8 space-y-4">
        <ToggleRow
          title="Tax Reminder"
          text="Remind me to review tax saving gaps before salary processing."
          checked={notifications.taxReminder}
          onClick={() => update("taxReminder")}
        />

        <ToggleRow
          title="Proof Upload Reminder"
          text="Remind me to upload 80C, 80D, NPS and rent proof documents."
          checked={notifications.proofReminder}
          onClick={() => update("proofReminder")}
        />

        <ToggleRow
          title="HR Report Reminder"
          text="Remind me to download and submit HR declaration report."
          checked={notifications.hrReminder}
          onClick={() => update("hrReminder")}
        />
      </div>

      <button
        type="button"
        onClick={saveNotifications}
        disabled={saving}
        className="mt-8 cursor-pointer rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-6 py-3 text-sm font-extrabold text-[#07100d] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Notifications"}
      </button>
    </div>
  );
}
function SettingsTab({ active, icon: Icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-3 flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-[#19b98540] bg-[#19b98518]"
          : "border-transparent bg-transparent hover:bg-[#0b1110]"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          active
            ? "bg-[#19b985] text-[#07100d]"
            : "bg-[#19221f] text-[#c9933a]"
        }`}
      >
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-[#e8f0ec]">{title}</h3>
        <p className="mt-0.5 text-xs text-[#7f8b85]">{text}</p>
      </div>
    </button>
  );
}

function ProfileSection({ user, initials }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImageUrl || "");

  

  const [originalData, setOriginalData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    profileImageUrl: user?.profileImageUrl || "",
  });

  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasChanges =
    name !== originalData.name ||
    phone !== originalData.phone ||
    image !== null;

  const saveProfile = async () => {
    if (!hasChanges) {
      alert("No changes found");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      if (name !== originalData.name) {
        formData.append("name", name);
      }

      if (phone !== originalData.phone) {
        formData.append("phone", phone);
      }

      if (image) {
        formData.append("profileImage", image);
      }

      const res = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

         const updatedUser = res.data.user;
        dispatch(
        setCredentials({
            token,
            user: updatedUser,
        })
        );

        setOriginalData({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        profileImageUrl: updatedUser.profileImageUrl || "",
        });

      setPreview(updatedUser.profileImageUrl || "");
      setImage(null);
      setEditingName(false);
      setEditingPhone(false);

      alert("Profile updated successfully");
    } catch {
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImage = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  return (
    <div>
      <SectionHeader
        icon={User}
        title="My Profile"
        text="View and update your account information."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[220px_1fr]">
        <div className="rounded-3xl border border-dashed border-[#3b4a44] bg-[#0b1110] p-6 text-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="h-28 w-28 rounded-3xl object-cover"
            />
            
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-[#e9ddff] text-3xl font-black text-[#4a2a88]">
              {initials}
            </div>
          )}

          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#27332f] bg-[#111917] px-4 py-3 text-xs font-extrabold text-[#19b985] hover:border-[#19b98555]">
            <Camera size={15} />
            Upload image
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0])}
            />
          </label>

          <p className="mt-3 text-xs text-[#7f8b85]">Max size: 1MB</p>
        </div>

        <div className="space-y-4">
          <EditableRow
            label="Name"
            value={name}
            editing={editingName}
            setEditing={setEditingName}
            onChange={setName}
            action="Change name"
          />

          <InfoRow label="Email" value={user?.email || "secure account"} />

          <EditableRow
            label="Phone number"
            value={phone}
            editing={editingPhone}
            setEditing={setEditingPhone}
            onChange={setPhone}
            action="Change phone number"
          />

          <InfoRow label="Country" value="India" />

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving || !hasChanges}
            className={`rounded-xl px-6 py-3 text-sm font-extrabold transition ${
              hasChanges
                ? "cursor-pointer bg-gradient-to-r from-[#c9933a] to-[#19b985] text-[#07100d] hover:scale-[1.02]"
                : "cursor-not-allowed border border-[#27332f] bg-[#111917] text-[#7f8b85]"
            } disabled:opacity-60`}
          >
            {saving ? "Saving..." : hasChanges ? "Save Updated Profile" : "No Changes"}
          </button>
        </div>
      </div>
    </div>
    
  );
}

function SecuritySection() {
  const user = useSelector((state) => state.auth.user);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setSavingPassword(true);

      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await api.post("/auth/logout-all");

      alert("Logged out from all devices");

      localStorage.clear();
      window.location.href = "/login";
    } catch {
      alert("Logout all devices failed");
    }
  };

  return (
    <div>
      <SectionHeader
        icon={ShieldCheck}
        title="Security"
        text="Manage password, sessions and account protection."
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
            <Lock size={22} />
          </div>

          <h3 className="mt-5 text-xl font-black">Change Password</h3>

          <p className="mt-3 text-sm leading-6 text-[#7f8b85]">
            Update your password to keep your account secure.
          </p>

          <button
            type="button"
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="mt-5 cursor-pointer rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-5 py-3 text-sm font-extrabold text-[#07100d]"
          >
            {showPasswordForm ? "Close form" : "Change password"}
          </button>

          {showPasswordForm && (
            <div className="mt-6 space-y-4 rounded-2xl border border-[#27332f] bg-[#111917] p-5">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="cursor-pointer rounded-xl bg-[#19b985] px-5 py-3 text-sm font-extrabold text-[#07100d] disabled:opacity-60"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
            <LogOut size={22} />
          </div>

          <h3 className="mt-5 text-xl font-black">Logout From All Devices</h3>

          <p className="mt-3 text-sm leading-6 text-[#7f8b85]">
            Before logout, confirm your active account details.
          </p>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="mt-5 cursor-pointer rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-5 py-3 text-sm font-extrabold text-[#07100d]"
          >
            Logout all devices
          </button>

          {showLogoutConfirm && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
              <p className="text-sm font-black text-red-300">
                Confirm Logout From All Devices
              </p>

              <div className="mt-4 rounded-xl border border-[#27332f] bg-[#111917] p-4">
                <p className="text-sm text-[#7f8b85]">Current Account</p>

                <h4 className="mt-1 text-base font-black text-[#e8f0ec]">
                  {user?.name || "TaxWise User"}
                </h4>

                <p className="mt-1 text-sm text-[#7f8b85]">
                  {user?.email || "secure account"}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#ffb4b4]">
                This will remove active sessions from all devices. You will need
                to login again.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleLogoutAllDevices}
                  className="cursor-pointer rounded-xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Yes, Logout All
                </button>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="cursor-pointer rounded-xl border border-[#27332f] bg-[#111917] px-5 py-3 text-sm font-extrabold text-[#e8f0ec]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <SecurityCard
          icon={CheckCircle2}
          title="Account Protection"
          text="Your account is protected with JWT authentication and OTP verification."
          button="Protected"
          disabled
        />

        <SecurityCard
          icon={AlertTriangle}
          title="Security Reminder"
          text="Never share your OTP, password, AWS keys or tax documents with anyone."
          button="Read only"
          disabled
        />
      </div>
    </div>
  );
}


function SectionHeader({ icon: Icon, title, text }) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19b98518] text-[#19b985]">
        <Icon size={22} />
      </div>

      <h2 className="mt-5 text-3xl font-black">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-[#7f8b85]">{text}</p>
    </div>
  );
}

function InfoRow({ label, value, action }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#27332f] bg-[#0b1110] p-5 md:grid-cols-[180px_1fr_160px]">
      <p className="text-sm font-bold text-[#7f8b85]">{label}</p>

      <p className="text-sm font-extrabold text-[#e8f0ec]">{value}</p>

      {action ? (
        <button
          type="button"
          className="text-left text-sm font-extrabold text-[#19b985] md:text-right"
        >
          {action}
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

function EditableRow({ label, value, editing, setEditing, onChange, action }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#27332f] bg-[#0b1110] p-5 md:grid-cols-[180px_1fr_180px]">
      <p className="text-sm font-bold text-[#7f8b85]">{label}</p>

      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-[#27332f] bg-[#111917] px-4 py-2 text-sm font-bold text-[#e8f0ec] outline-none"
        />
      ) : (
        <p className="text-sm font-extrabold text-[#e8f0ec]">
          {value || "Not added"}
        </p>
      )}

      <button
        type="button"
        onClick={() => setEditing(!editing)}
        className="cursor-pointer text-left text-sm font-extrabold text-[#19b985] hover:text-[#27e6a3] md:text-right"
      >
        {editing ? "Done" : action}
      </button>
    </div>
  );
}



function SecurityCard({ icon: Icon, title, text, button, disabled }) {
  return (
    <div className="rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#7f8b85]">{text}</p>

      <button
        type="button"
        disabled={disabled}
        className={`mt-5 rounded-xl px-5 py-3 text-sm font-extrabold ${
          disabled
            ? "cursor-not-allowed border border-[#27332f] bg-[#111917] text-[#7f8b85]"
            : "bg-gradient-to-r from-[#c9933a] to-[#19b985] text-[#07100d]"
        }`}
      >
        {button}
      </button>
    </div>
  );
}

function ToggleRow({ title, text, checked, onClick }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#27332f] bg-[#0b1110] p-5">
      <div>
        <h3 className="text-base font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#7f8b85]">{text}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative h-8 w-16 rounded-full transition ${
          checked ? "bg-[#19b985]" : "bg-[#27332f]"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            checked ? "left-9" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
function PasswordInput({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec] outline-none"
      />
    </div>
  );
}