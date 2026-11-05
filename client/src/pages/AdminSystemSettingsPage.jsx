// src/pages/AdminCareerRolesPage.jsx
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
      <div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Here to help you grow
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Get help with your profile, skills and assessments.
        </p>
        <a
          href="#"
          className="text-xs font-medium text-primary mt-3 inline-block"
        >
          Visit help center ↗
        </a>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">
          AU
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            Admin User
          </p>
          <p className="text-xs text-slate-500">Admin account</p>
        </div>
      </div>
      <div className="px-6 pb-4">
        <Link
          to="/"
          className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Log out
        </Link>
      </div>
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
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
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

const CATEGORY_OPTIONS = [
  "Software development",
  "Data & analytics",
  "Design",
  "Product & management",
  "IT & infrastructure",
];
const STATUS_OPTIONS = ["Active", "Draft", "Inactive"];

function todayFormatted() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function emptyRoleForm() {
  return {
    name: "",
    category: CATEGORY_OPTIONS[0],
    status: "Draft",
    skillsText: "",
    candidates: 0,
    assessments: 0,
  };
}

// TODO (backend step): replace with real career roles from the API.
const initialRoles = [
  {
    name: "Backend Developer",
    category: "Software development",
    status: "Active",
    skills: ["Java", "Spring Boot", "SQL", "REST APIs"],
    candidates: 428,
    assessments: 8,
    updated: "05/07/2026",
  },
  {
    name: "Frontend Developer",
    category: "Software development",
    status: "Active",
    skills: ["React", "JavaScript", "CSS", "Tailwind CSS"],
    candidates: 392,
    assessments: 9,
    updated: "06/07/2026",
  },
  {
    name: "Data Analyst",
    category: "Data & analytics",
    status: "Active",
    skills: ["SQL", "Excel", "Power BI", "Python"],
    candidates: 186,
    assessments: 6,
    updated: "08/08/2026",
  },
  {
    name: "Data Scientist",
    category: "Data & analytics",
    status: "Active",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    candidates: 186,
    assessments: 6,
    updated: "09/08/2026",
  },
  {
    name: "Data Engineer",
    category: "Data & analytics",
    status: "Active",
    skills: ["Python", "ETL", "SQL", "Cloud platforms"],
    candidates: 194,
    assessments: 5,
    updated: "19/09/2026",
  },
];

export default function AdminCareerRolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Category");
  const [statusFilter, setStatusFilter] = useState("Status");

  const [addingRole, setAddingRole] = useState(false);
  const [roleForm, setRoleForm] = useState(emptyRoleForm());

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editingRole, setEditingRole] = useState(null); // { index, data: { ...role, skillsText } }
  const [deletingRole, setDeletingRole] = useState(null); // { index, name }

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

  function toggleHeaderMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  const categoryOptions = [
    "Category",
    ...new Set(roles.map((r) => r.category)),
  ];
  const statusOptions = ["Status", ...new Set(roles.map((r) => r.status))];

  const filtered = roles.filter((r) => {
    if (searchText && !r.name.toLowerCase().includes(searchText.toLowerCase()))
      return false;
    if (categoryFilter !== "Category" && r.category !== categoryFilter)
      return false;
    if (statusFilter !== "Status" && r.status !== statusFilter) return false;
    return true;
  });

  function parseSkills(text) {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // ---- Add career role ----
  function openAddRole() {
    setRoleForm(emptyRoleForm());
    setAddingRole(true);
  }

  function saveNewRole(e) {
    e.preventDefault();
    const newRole = {
      name: roleForm.name || "Untitled role",
      category: roleForm.category,
      status: roleForm.status,
      skills: parseSkills(roleForm.skillsText),
      candidates: 0,
      assessments: 0,
      updated: todayFormatted(),
    };
    setRoles((prev) => [newRole, ...prev]);
    setAddingRole(false);
  }

  // ---- Row actions ----
  function toggleMenu(index) {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  }

  function viewDetails(r) {
    setOpenMenuIndex(null);
    alert(
      `${r.name}\nCategory: ${r.category}\nStatus: ${r.status}\nRequired skills: ${r.skills.join(", ")}\nCandidates: ${r.candidates}\nAssessments: ${r.assessments}`,
    );
  }

  function duplicateRole(index) {
    setRoles((prev) => {
      const original = prev[index];
      const copy = {
        ...original,
        name: `${original.name} (copy)`,
        candidates: 0,
        updated: todayFormatted(),
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setOpenMenuIndex(null);
  }

  function toggleStatus(index) {
    setRoles((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r,
      ),
    );
    setOpenMenuIndex(null);
  }

  function openEditRole(index) {
    const r = roles[index];
    setEditingRole({ index, data: { ...r, skillsText: r.skills.join(", ") } });
    setOpenMenuIndex(null);
  }

  function saveEdit(e) {
    e.preventDefault();
    setRoles((prev) =>
      prev.map((r, i) =>
        i === editingRole.index
          ? {
              ...editingRole.data,
              skills: parseSkills(editingRole.data.skillsText),
              updated: todayFormatted(),
            }
          : r,
      ),
    );
    setEditingRole(null);
  }

  function confirmDelete() {
    setRoles((prev) => prev.filter((_, i) => i !== deletingRole.index));
    setDeletingRole(null);
  }

  const activeCount = roles.filter((r) => r.status === "Active").length;
  const draftCount = roles.filter((r) => r.status === "Draft").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Career roles
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage career roles and their required skills.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openAddRole}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Add career role
            </button>
            <div className="flex items-center gap-4" ref={menuRef}>
              {/* Help dropdown */}
              <div className="relative">
                <button
                  aria-label="Help"
                  onClick={() => toggleHeaderMenu("help")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3" strokeLinecap="round" />
                    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                  </svg>
                </button>
                {openMenu === "help" && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Visit help center</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy policy</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of service</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About us</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Give feedback about Credify</a>
                  </div>
                )}
              </div>

              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={() => toggleHeaderMenu("notifications")}
                  className="relative text-gray-400 hover:text-gray-600"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
                  </svg>
                  <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                </button>
                {openMenu === "notifications" && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <p className="px-4 py-2 text-sm font-semibold text-gray-900">Notifications</p>
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
                <button onClick={() => toggleHeaderMenu("profile")} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                    AU
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 sm:block">Admin User</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openMenu === "profile" && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                    <div className="my-1 border-t border-gray-100" />
                    <Link to="/" className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">Log out</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total career roles</p>
              <p className="text-3xl font-bold text-slate-900">
                {roles.length}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                All roles on the platform
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Active roles</p>
              <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
              <p className="text-xs text-slate-500 mt-2">
                Visible to candidates
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Draft roles</p>
              <p className="text-3xl font-bold text-slate-900">{draftCount}</p>
              <p className="text-xs text-slate-500 mt-2">Not yet published</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Most selected role</p>
              <p className="text-lg font-bold text-slate-900 mt-2">
                Full-stack developer
              </p>
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
                placeholder="Search career roles…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {categoryOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {statusOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Career role</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Required skills</th>
                  <th className="pb-2 font-semibold">Candidates</th>
                  <th className="pb-2 font-semibold">Assessments</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Last updated</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.name + i} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">
                      {r.name}
                    </td>
                    <td className="text-slate-600">{r.category}</td>
                    <td>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold">
                        {r.skills.length}
                      </span>
                    </td>
                    <td className="text-slate-900 font-semibold">
                      {r.candidates}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold">
                        {r.assessments}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : r.status === "Draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="text-slate-600">{r.updated}</td>
                    <td className="relative">
                      <div className="flex gap-2 text-slate-400">
                        <button
                          onClick={() => toggleMenu(i)}
                          className="hover:text-slate-600"
                        >
                          ⋯
                        </button>
                        <button
                          onClick={() => openEditRole(i)}
                          className="text-primary hover:text-primary-dark"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            setDeletingRole({ index: i, name: r.name })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>

                      {openMenuIndex === i && (
                        <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                          <button
                            onClick={() => viewDetails(r)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => duplicateRole(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Duplicate role
                          </button>
                          <button
                            onClick={() => toggleStatus(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {r.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      No career roles match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">
              Showing {filtered.length} of {roles.length} roles
            </p>
          </div>
        </main>
      </div>

      {/* Add career role modal */}
      {addingRole && (
        <Modal title="Add career role" onClose={() => setAddingRole(false)}>
          <form onSubmit={saveNewRole} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Career role
              </label>
              <input
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Full-stack Developer"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={roleForm.category}
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={roleForm.status}
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required skills
              </label>
              <input
                value={roleForm.skillsText}
                onChange={(e) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    skillsText: e.target.value,
                  }))
                }
                placeholder="Comma-separated, e.g. React, JavaScript, CSS"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Separate each skill with a comma.
              </p>
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Add career role
            </button>
          </form>
        </Modal>
      )}

      {/* Edit career role modal */}
      {editingRole && (
        <Modal
          title={`Edit ${editingRole.data.name}`}
          onClose={() => setEditingRole(null)}
        >
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Career role
              </label>
              <input
                value={editingRole.data.name}
                onChange={(e) =>
                  setEditingRole((prev) => ({
                    ...prev,
                    data: { ...prev.data, name: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={editingRole.data.category}
                onChange={(e) =>
                  setEditingRole((prev) => ({
                    ...prev,
                    data: { ...prev.data, category: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={editingRole.data.status}
                onChange={(e) =>
                  setEditingRole((prev) => ({
                    ...prev,
                    data: { ...prev.data, status: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required skills
              </label>
              <input
                value={editingRole.data.skillsText}
                onChange={(e) =>
                  setEditingRole((prev) => ({
                    ...prev,
                    data: { ...prev.data, skillsText: e.target.value },
                  }))
                }
                placeholder="Comma-separated, e.g. React, JavaScript, CSS"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Separate each skill with a comma.
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
      {deletingRole && (
        <Modal title="Delete career role" onClose={() => setDeletingRole(null)}>
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {deletingRole.name}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingRole(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Delete role
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
