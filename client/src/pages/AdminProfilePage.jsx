// src/pages/AdminProfilePage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Users", path: "/admin/users" },
  { label: "Career Roles", path: "/admin/career-roles" },
  { label: "Skills", path: "/admin/skills" },
  { label: "Assessments", path: "/admin/assessments" },
  { label: "Reports", path: "/admin/reports" },
  { label: "System Settings", path: "/admin/settings" },
];

const notifications = [
  {
    title: "New recruiter signup",
    detail: "TechVision Solutions registered as a new recruiter",
  },
  {
    title: "Flagged assessment content",
    detail: "A candidate reported an issue with the SQL assessment",
  },
  {
    title: "Weekly platform report ready",
    detail: "Your usage and activity summary is ready to view",
  },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto w-60 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-primary">Credify</span>
      </div>
      <p className="px-6 text-[11px] tracking-wide text-slate-500">
        ADMIN WORKSPACE
      </p>
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                active
                  ? "text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// TODO (backend step): replace with the real signed-in admin's profile from the API.
const initialProfile = {
  name: "Admin User",
  email: "admin@credify.app",
  phone: "+94 71 234 5678",
  role: "Super Admin",
  department: "Platform Operations",
  adminId: "ADM-00124",
  joined: "12/01/2025",
  lastLogin: "Today, 09:42 AM",
};

// TODO (backend step): replace with the real role/permission matrix from the API.
const initialPermissions = [
  { key: "users", label: "Manage users", description: "Create, suspend, edit and delete candidate, recruiter and admin accounts.", enabled: true },
  { key: "content", label: "Manage content", description: "Edit help center, privacy policy, terms of service, about us and feedback.", enabled: true },
  { key: "assessments", label: "Manage assessments", description: "Create, edit, publish and remove assessments and question banks.", enabled: true },
  { key: "careerRolesSkills", label: "Manage career roles & skills", description: "Edit the career role and skill taxonomy used across the platform.", enabled: true },
  { key: "reports", label: "View reports & analytics", description: "Access platform-wide usage, verification and recruitment reports.", enabled: true },
  { key: "systemSettings", label: "Manage system settings", description: "Change platform-wide configuration, security and danger-zone actions.", enabled: false },
];

// TODO (backend step): replace with the real admin activity/audit log from the API.
const initialActivityLog = [
  { id: 1, action: "Suspended account", detail: "Suspended recruiter account rajnazeer@gmail.com", time: "Today, 10:12 AM" },
  { id: 2, action: "Published assessment", detail: "Published \"Java Programming\" assessment", time: "Yesterday, 4:05 PM" },
  { id: 3, action: "Updated content", detail: "Edited the Privacy Policy \"Data sharing\" section", time: "Yesterday, 2:40 PM" },
  { id: 4, action: "Reviewed feedback", detail: "Marked a bug report from chethina.sri@example.com as reviewed", time: "2 days ago" },
  { id: 5, action: "Added career role", detail: "Added \"Cloud Engineer\" as a new career role", time: "4 days ago" },
];

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(initialProfile);

  const [permissions] = useState(initialPermissions);
  const [activityLog] = useState(initialActivityLog);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  // header dropdown state: 'help' | 'notifications' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  function flashSaved(message) {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(""), 3000);
  }

  // ---- Edit profile ----
  function openEditProfile() {
    setProfileDraft(profile);
    setEditingProfile(true);
  }

  function saveProfile(e) {
    e.preventDefault();
    // TODO (backend step): PATCH /api/admin/profile with profileDraft.
    setProfile(profileDraft);
    setEditingProfile(false);
    flashSaved("Profile updated.");
  }

  // ---- Change password ----
  function openChangePassword() {
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordError("");
    setChangingPassword(true);
  }

  function savePassword(e) {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    // TODO (backend step): POST /api/admin/change-password with passwordForm.
    setChangingPassword(false);
    flashSaved("Password changed.");
  }

  function toggleTwoFactor() {
    // TODO (backend step): PATCH /api/admin/security with the new 2FA state.
    setTwoFactorEnabled((v) => !v);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              My profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your admin account, permissions and recent activity on Credify.
            </p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            {/* Help dropdown */}
            <div className="relative">
              <button
                aria-label="Help"
                onClick={() => toggleMenu("help")}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                </svg>
              </button>
              {openMenu === "help" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/admin/help-center"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage help center
                  </Link>
                  <Link
                    to="/admin/privacy-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage privacy policy
                  </Link>
                  <Link
                    to="/admin/terms-of-service"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage terms of service
                  </Link>
                  <Link
                    to="/admin/about-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage about us
                  </Link>
                  <Link
                    to="/admin/feedback"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage feedback
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications dropdown */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => toggleMenu("notifications")}
                className="relative text-gray-400 hover:text-gray-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
                </svg>
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              {openMenu === "notifications" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-900">
                    Notifications
                  </p>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <a
                        key={n.title}
                        href="#"
                        className="block border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        <span className="block font-medium text-gray-900">
                          {n.title}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {n.detail}
                        </span>
                      </a>
                    ))}
                  </div>
                  <Link
                    to="#"
                    className="block border-t border-gray-100 px-4 py-2 text-center text-sm font-semibold text-primary hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("profile")}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                  AU
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  Admin User
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openMenu === "profile" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50"
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          {savedMessage && (
            <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
              {savedMessage}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Identity card */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-primary">
                    AU
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {profile.name}
                    </h2>
                    <p className="text-sm text-slate-500">{profile.email}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-xs font-semibold">
                      {profile.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={openEditProfile}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Edit profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Admin ID</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.adminId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Joined</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.joined}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Last login</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.lastLogin}
                  </p>
                </div>
              </div>
            </div>

            {/* Account security */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Account security</h3>
              <button
                onClick={openChangePassword}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Change password
              </button>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Two-factor authentication
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adds an extra step when signing in.
                  </p>
                </div>
                <button
                  onClick={toggleTwoFactor}
                  className={`w-10 h-5.5 rounded-full relative transition-colors ${
                    twoFactorEnabled ? "bg-green-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Permissions */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-1">
                Role & permissions
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                What your admin role can do on the platform. Permissions are
                assigned by a super admin.
              </p>
              <div className="space-y-3">
                {permissions.map((p) => (
                  <div
                    key={p.key}
                    className="flex items-start justify-between gap-4 border-t border-slate-100 first:border-0 pt-3 first:pt-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {p.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.enabled
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.enabled ? "✓ Enabled" : "Not enabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity log */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-1">
                Recent activity
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Your most recent admin actions.
              </p>
              <div className="space-y-4">
                {activityLog.map((a) => (
                  <div key={a.id} className="text-sm">
                    <p className="font-medium text-slate-900">{a.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.detail}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit profile modal */}
      {editingProfile && (
        <Modal title="Edit profile" onClose={() => setEditingProfile(false)}>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                value={profileDraft.name}
                onChange={(e) =>
                  setProfileDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profileDraft.email}
                onChange={(e) =>
                  setProfileDraft((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone
              </label>
              <input
                value={profileDraft.phone}
                onChange={(e) =>
                  setProfileDraft((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department
              </label>
              <input
                value={profileDraft.department}
                onChange={(e) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {/* Change password modal */}
      {changingPassword && (
        <Modal
          title="Change password"
          onClose={() => setChangingPassword(false)}
        >
          <form onSubmit={savePassword} className="space-y-4">
            {passwordError && (
              <p className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">
                {passwordError}
              </p>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    current: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, next: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirm: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Update password
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}