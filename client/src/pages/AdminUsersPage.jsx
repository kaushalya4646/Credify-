import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

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

const registrationDateOptions = [
  "Registration date",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This year",
];

function roleLabel(role) {
  if (!role) return "";
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function initialsFor(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function matchesRegistrationDate(createdAt, filterValue, today) {
  if (filterValue === "Registration date") return true;
  const date = new Date(createdAt);
  const diffDays = (today - date) / (1000 * 60 * 60 * 24);
  if (filterValue === "Last 7 days") return diffDays <= 7;
  if (filterValue === "Last 30 days") return diffDays <= 30;
  if (filterValue === "Last 90 days") return diffDays <= 90;
  if (filterValue === "This year")
    return date.getFullYear() === today.getFullYear();
  return true;
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [userType, setUserType] = useState("User type");
  const [accountStatus, setAccountStatus] = useState("Account status");
  const [registrationDate, setRegistrationDate] = useState("Registration date");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

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

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.get("/api/admin/users");
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  const today = new Date();

  const filteredUsers = users.filter((u) => {
    if (
      searchText &&
      !u.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    if (userType !== "User type" && roleLabel(u.role) !== userType) return false;
    const status = u.isActive ? "Active" : "Suspended";
    if (accountStatus !== "Account status" && status !== accountStatus) return false;
    if (!matchesRegistrationDate(u.createdAt, registrationDate, today)) return false;
    return true;
  });

  const totalUsers = users.length;
  const candidateCount = users.filter((u) => u.role === "CANDIDATE").length;
  const recruiterCount = users.filter((u) => u.role === "RECRUITER").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  function toggleRowMenu(index) {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  }

  async function toggleSuspend(user) {
    setOpenMenuIndex(null);
    try {
      const updated = await api.put(`/api/admin/users/${user.id}/status`, {
        isActive: !user.isActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: updated.isActive } : u))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update this user's status.");
    }
  }

  async function resetPassword(user) {
    setOpenMenuIndex(null);
    try {
      const result = await api.post(`/api/admin/users/${user.id}/reset-password`, {});
      alert(
        `Password reset for ${user.email}.\n\nTemporary password: ${result.tempPassword}\n\nShare this with the user — there is no automatic email yet.`
      );
    } catch (err) {
      console.error("Failed to reset password:", err);
      alert("Could not reset this user's password.");
    }
  }

  function viewDetails(user) {
    setOpenMenuIndex(null);
    setViewingUser(user);
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      const updated = await api.put(`/api/admin/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Could not save changes for this user.");
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/api/admin/users/${deletingUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Could not remove this user.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage candidates, recruiters and admins on the platform.
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
                  <Link to="/admin/help-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage help center</Link>
                  <Link to="/admin/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage privacy policy</Link>
                  <Link to="/admin/terms-of-service" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage terms of service</Link>
                  <Link to="/admin/about-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage about us</Link>
                  <Link to="/admin/feedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage feedback</Link>
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
                      <a key={n.title} href="#" className="block border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50">
                        <span className="block font-medium text-gray-900">{n.title}</span>
                        <span className="block text-xs text-gray-500">{n.detail}</span>
                      </a>
                    ))}
                  </div>
                  <Link to="#" className="block border-t border-gray-100 px-4 py-2 text-center text-sm font-semibold text-primary hover:underline">
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
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openMenu === "profile" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <div className="my-1 border-t border-gray-100" />
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total users</p>
              <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Candidates</p>
              <p className="text-3xl font-bold text-slate-900">{candidateCount}</p>
              <p className="text-xs text-slate-500 mt-2">
                {totalUsers ? Math.round((candidateCount / totalUsers) * 100) : 0}% of users
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recruiters</p>
              <p className="text-3xl font-bold text-slate-900">{recruiterCount}</p>
              <p className="text-xs text-slate-500 mt-2">
                {totalUsers ? Math.round((recruiterCount / totalUsers) * 100) : 0}% of users
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Admins</p>
              <p className="text-3xl font-bold text-slate-900">{adminCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">
              Search and filters
            </h2>
            <div className="flex gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                <option>User type</option>
                <option>Candidate</option>
                <option>Recruiter</option>
                <option>Admin</option>
              </select>
              <select
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                <option>Account status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
              <select
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {registrationDateOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Loading users…</p>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs">
                      <th className="pb-2 font-semibold">User</th>
                      <th className="pb-2 font-semibold">Email</th>
                      <th className="pb-2 font-semibold">Account type</th>
                      <th className="pb-2 font-semibold">Career role</th>
                      <th className="pb-2 font-semibold">Verification</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Registered</th>
                      <th className="pb-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className="border-t border-slate-100">
                        <td className="py-3 flex items-center gap-2 font-semibold text-slate-900">
                          <span className="w-7 h-7 rounded-full bg-blue-50 text-primary text-[10px] font-semibold flex items-center justify-center">
                            {initialsFor(u.name)}
                          </span>
                          {u.name}
                        </td>
                        <td className="text-slate-600">{u.email}</td>
                        <td className="text-slate-900">{roleLabel(u.role)}</td>
                        <td className="text-slate-600">{u.careerRole || "—"}</td>
                        <td>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.verified
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {u.verified ? "✓ Verified" : "Unverified"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {u.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="text-slate-600">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative">
                          <div className="flex gap-2 text-slate-400">
                            <button
                              onClick={() => toggleRowMenu(i)}
                              className="hover:text-slate-600"
                            >
                              ⋯
                            </button>
                            <button
                              onClick={() =>
                                setEditingUser({ ...u })
                              }
                              className="text-primary hover:text-primary-dark"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() =>
                                setDeletingUser({ id: u.id, name: u.name })
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>

                          {openMenuIndex === i && (
                            <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                              <button
                                onClick={() => viewDetails(u)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                View details
                              </button>
                              <button
                                onClick={() => toggleSuspend(u)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                {u.isActive ? "Suspend account" : "Activate account"}
                              </button>
                              <button
                                onClick={() => resetPassword(u)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                Reset password
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-sm text-slate-500"
                        >
                          No users match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 mt-4">
                  Showing {filteredUsers.length} of {totalUsers} users
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* View details modal */}
      {viewingUser && (
        <Modal
          title={viewingUser.name}
          onClose={() => setViewingUser(null)}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-primary">
                {initialsFor(viewingUser.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingUser.name}
                </p>
                <p className="text-xs text-slate-500">{viewingUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Account type</p>
                <p className="text-sm font-medium text-slate-900">
                  {roleLabel(viewingUser.role)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Career role</p>
                <p className="text-sm font-medium text-slate-900">
                  {viewingUser.careerRole || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewingUser.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {viewingUser.isActive ? "Active" : "Suspended"}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Verification</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewingUser.verified
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {viewingUser.verified ? "✓ Verified" : "Unverified"}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Registered</p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(viewingUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewingUser(null)}
              className="w-full min-h-11 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Edit user modal */}
      {editingUser && (
        <Modal
          title={`Edit ${editingUser.name}`}
          onClose={() => setEditingUser(null)}
        >
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser((prev) => ({ ...prev, name: e.target.value }))
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
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account type
              </label>
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Career role
              </label>
              <p className="w-full px-4 py-2.5 rounded-lg border border-slate-100 bg-slate-50 text-sm text-slate-500">
                {editingUser.careerRole || "— (set by the candidate)"}
              </p>
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

      {/* Delete confirmation modal */}
      {deletingUser && (
        <Modal title="Remove user" onClose={() => setDeletingUser(null)}>
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-slate-900">
              {deletingUser.name}
            </span>{" "}
            from the platform? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingUser(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Remove user
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}