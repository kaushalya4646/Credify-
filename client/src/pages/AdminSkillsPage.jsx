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

const SKILL_TYPES = ["Technical skill", "Soft skill", "Tool/platform"];
const STATUS_OPTIONS = ["Active", "Draft", "Inactive"];
const UNCATEGORIZED = "Uncategorized";
const NOT_SET = "Not set";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Group the flat skill list into one row per category. Category-level type and
// status come from the member skills; if they disagree the row shows "Mixed".
function groupByCategory(skills) {
  const groups = new Map();
  for (const s of skills) {
    const key = s.category ?? null;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  const rows = [...groups.entries()].map(([category, members]) => {
    const types = [...new Set(members.map((m) => m.type ?? null))];
    const statuses = [...new Set(members.map((m) => m.status))];
    return {
      key: category ?? "__uncategorized__",
      category,
      label: category ?? UNCATEGORIZED,
      uncategorized: category == null,
      skills: [...members].sort((a, b) => a.name.localeCompare(b.name)),
      type: types.length === 1 ? types[0] : "Mixed",
      status: statuses.length === 1 ? statuses[0] : "Mixed",
      usage: members.reduce((sum, m) => sum + (m.usage || 0), 0),
    };
  });
  // Named categories alphabetically, "Uncategorized" last.
  return rows.sort((a, b) =>
    a.uncategorized ? 1 : b.uncategorized ? -1 : a.label.localeCompare(b.label),
  );
}

function typeLabel(type) {
  return type ?? NOT_SET;
}

function statusClasses(status) {
  if (status === "Active") return "bg-green-50 text-green-700";
  if (status === "Draft") return "bg-amber-50 text-amber-700";
  if (status === "Mixed") return "bg-blue-50 text-primary";
  return "bg-slate-100 text-slate-600";
}

function parseSkills(text) {
  return [
    ...new Set(
      text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

function emptyCategoryForm() {
  return { category: "", type: SKILL_TYPES[0], status: "Active", skillsText: "" };
}

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState(""); // page-level error from row actions

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Skill category");
  const [typeFilter, setTypeFilter] = useState("Skill type");
  const [statusFilter, setStatusFilter] = useState("Status");

  const [addingSkill, setAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", category: "" });

  // categoryModal: { mode: "add" | "edit" | "duplicate", original?: row, form }
  const [categoryModal, setCategoryModal] = useState(null);
  // Skill names that already belong to another category and would be moved.
  const [moveWarning, setMoveWarning] = useState(null);

  const [openMenuKey, setOpenMenuKey] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [viewingRow, setViewingRow] = useState(null);

  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

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

  async function loadSkills() {
    try {
      setSkills((await api.get("/api/skills")) || []);
      setLoadError("");
    } catch (err) {
      console.error("Failed to load skills:", err);
      setLoadError(err.message || "Could not load skills.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  const rows = groupByCategory(skills);
  const namedRows = rows.filter((r) => !r.uncategorized);

  // ---- Stats ----
  const totalSkills = skills.length;
  const categoryCount = namedRows.length;
  const verifiedCount = skills.filter((s) => s.usage > 0).length;
  const verifiedPct = totalSkills
    ? Math.round((verifiedCount / totalSkills) * 100)
    : 0;
  const now = Date.now();
  const recentCount = skills.filter(
    (s) => now - new Date(s.createdAt).getTime() <= THIRTY_DAYS_MS,
  ).length;

  // ---- Filters ----
  const categoryOptions = ["Skill category", ...rows.map((r) => r.label)];
  const typeOptions = ["Skill type", ...new Set(rows.map((r) => typeLabel(r.type)))];
  const statusOptions = ["Status", ...new Set(rows.map((r) => r.status))];

  const search = searchText.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (
      search &&
      !r.label.toLowerCase().includes(search) &&
      !r.skills.some((s) => s.name.toLowerCase().includes(search))
    )
      return false;
    if (categoryFilter !== "Skill category" && r.label !== categoryFilter) return false;
    if (typeFilter !== "Skill type" && typeLabel(r.type) !== typeFilter) return false;
    if (statusFilter !== "Status" && r.status !== statusFilter) return false;
    return true;
  });

  function closeModals() {
    setAddingSkill(false);
    setCategoryModal(null);
    setMoveWarning(null);
    setDeletingRow(null);
    setModalError("");
  }

  // ---- Add skill ----
  function openAddSkill() {
    setSkillForm({ name: "", category: namedRows[0]?.category ?? "" });
    setModalError("");
    setAddingSkill(true);
  }

  async function saveNewSkill(e) {
    e.preventDefault();
    const name = skillForm.name.trim();
    if (!name) {
      setModalError("Enter a skill name.");
      return;
    }
    // New skills inherit the category's type/status (Active if it's mixed).
    const row = namedRows.find((r) => r.category === skillForm.category);
    setSaving(true);
    try {
      await api.post("/api/skills", {
        name,
        category: skillForm.category || null,
        type: row && row.type !== "Mixed" ? row.type : null,
        status: row && row.status !== "Mixed" ? row.status : "Active",
      });
      closeModals();
      await loadSkills();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---- Add / edit / duplicate category ----
  function openAddCategory() {
    setModalError("");
    setMoveWarning(null);
    setCategoryModal({ mode: "add", form: emptyCategoryForm() });
  }

  function formFromRow(row) {
    return {
      category: row.category,
      type: row.type === "Mixed" ? SKILL_TYPES[0] : (row.type ?? ""),
      status: row.status === "Mixed" ? "Active" : row.status,
      skillsText: row.skills.map((s) => s.name).join(", "),
    };
  }

  function openEditCategory(row) {
    setOpenMenuKey(null);
    setModalError("");
    setMoveWarning(null);
    setCategoryModal({ mode: "edit", original: row, form: formFromRow(row) });
  }

  // Skill names are unique, so a duplicate copies the category's settings
  // but needs its own skills (re-using the names would move the originals).
  function openDuplicateCategory(row) {
    setOpenMenuKey(null);
    setModalError("");
    setMoveWarning(null);
    setCategoryModal({
      mode: "duplicate",
      original: row,
      form: { ...formFromRow(row), category: `${row.category} (copy)`, skillsText: "" },
    });
  }

  function updateCategoryForm(field, value) {
    setMoveWarning(null);
    setCategoryModal((prev) => ({ ...prev, form: { ...prev.form, [field]: value } }));
  }

  async function saveCategory(e) {
    e.preventDefault();
    const { mode, original, form } = categoryModal;
    const category = form.category.trim();
    const skillNames = parseSkills(form.skillsText);
    if (!category) {
      setModalError("Enter a category name.");
      return;
    }
    if (category.toLowerCase() === UNCATEGORIZED.toLowerCase()) {
      setModalError(`"${UNCATEGORIZED}" is reserved for skills without a category.`);
      return;
    }
    if (skillNames.length === 0) {
      setModalError("Add at least one skill.");
      return;
    }

    // Saving re-assigns any listed skill that currently lives in another
    // category. Make the admin confirm that before it happens.
    const ownCategory = mode === "edit" ? original.category : null;
    const moving = skills.filter(
      (s) =>
        skillNames.some((n) => n.toLowerCase() === s.name.toLowerCase()) &&
        s.category !== ownCategory &&
        s.category !== category,
    );
    if (moving.length > 0 && !moveWarning) {
      setMoveWarning(moving);
      return;
    }

    const body = {
      type: form.type || null,
      status: form.status,
      skillNames,
    };
    setSaving(true);
    setModalError("");
    try {
      if (mode === "edit") {
        await api.put(
          `/api/skills/categories/${encodeURIComponent(original.category)}`,
          { ...body, newCategoryName: category },
        );
      } else {
        await api.post("/api/skills/categories", { ...body, category });
      }
      closeModals();
      await loadSkills();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---- Row actions ----
  function toggleMenu(key) {
    setOpenMenuKey((prev) => (prev === key ? null : key));
  }

  function viewDetails(row) {
    setOpenMenuKey(null);
    setViewingRow(row);
  }

  async function toggleStatus(row) {
    setOpenMenuKey(null);
    setNotice("");
    // Update each skill's status on its own so their individual types are kept.
    const status = row.status === "Active" ? "Inactive" : "Active";
    try {
      await Promise.all(
        row.skills.map((s) => api.put(`/api/skills/${s.id}`, { status })),
      );
      await loadSkills();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function confirmDelete() {
    setSaving(true);
    setModalError("");
    try {
      await api.delete(`/api/skills/categories/${encodeURIComponent(deletingRow.category)}`);
      closeModals();
      await loadSkills();
    } catch (err) {
      // Includes the backend's "these skills are in use: …" message on 409.
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Skills</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage the skill taxonomy used across career roles and
              assessments.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={openAddSkill}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
              >
                Add skill
              </button>
              <button
                onClick={openAddCategory}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
              >
                Add skill category
              </button>
            </div>
            <div className="flex items-center gap-4" ref={menuRef}>
              {/* Help dropdown */}
              <div className="relative">
                <button
                  aria-label="Help"
                  onClick={() => toggleHeaderMenu("help")}
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
                  onClick={() => toggleHeaderMenu("notifications")}
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
                  onClick={() => toggleHeaderMenu("profile")}
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
                    <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          {notice && (
            <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total skills</p>
              <p className="text-3xl font-bold text-slate-900">{totalSkills}</p>
              <p className="text-xs text-slate-500 mt-2">
                Across all categories
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Skill categories</p>
              <p className="text-3xl font-bold text-slate-900">
                {categoryCount}
              </p>
              <p className="text-xs text-slate-500 mt-2">Macro skills</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Verified skills</p>
              <p className="text-3xl font-bold text-slate-900">
                {verifiedCount}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {verifiedPct}% of all skills verified by a candidate
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recently added</p>
              <p className="text-3xl font-bold text-slate-900">{recentCount}</p>
              <p className="text-xs text-slate-500 mt-2">In the last 30 days</p>
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
                placeholder="Search skills"
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {typeOptions.map((o) => (
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
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Micro skills</th>
                  <th className="pb-2 font-semibold">Usage</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      Loading skills…
                    </td>
                  </tr>
                )}
                {!loading && loadError && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-red-600">
                      {loadError}
                    </td>
                  </tr>
                )}
                {!loading &&
                  !loadError &&
                  filtered.map((r) => (
                    <tr key={r.key} className="border-t border-slate-100">
                      <td className="py-3 pr-4 align-top">
                        <p
                          className={`font-semibold ${r.uncategorized ? "text-slate-500 italic" : "text-slate-900"}`}
                        >
                          {r.label}
                        </p>
                        <p className="text-xs text-slate-500">{typeLabel(r.type)}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {r.skills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium"
                            >
                              ✓ {s.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-slate-600 pr-4">
                        {r.usage} verification{r.usage === 1 ? "" : "s"}
                      </td>
                      <td className="pr-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="relative">
                        <div className="flex gap-2 text-slate-400">
                          <button
                            onClick={() => toggleMenu(r.key)}
                            className="hover:text-slate-600"
                            aria-label={`More actions for ${r.label}`}
                          >
                            ⋯
                          </button>
                          {!r.uncategorized && (
                            <>
                              <button
                                onClick={() => openEditCategory(r)}
                                className="text-primary hover:text-primary-dark"
                                aria-label={`Edit ${r.label}`}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => {
                                  setModalError("");
                                  setDeletingRow(r);
                                }}
                                className="text-red-600 hover:text-red-700"
                                aria-label={`Delete ${r.label}`}
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>

                        {openMenuKey === r.key && (
                          <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                            <button
                              onClick={() => viewDetails(r)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              View details
                            </button>
                            {!r.uncategorized && (
                              <>
                                <button
                                  onClick={() => openDuplicateCategory(r)}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  Duplicate category
                                </button>
                                <button
                                  onClick={() => toggleStatus(r)}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  {r.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                {!loading && !loadError && filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      {rows.length === 0
                        ? "No skills yet. Add a skill category to get started."
                        : "No skill categories match these filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">
              Showing {filtered.length} of {rows.length} group
              {rows.length === 1 ? "" : "s"}
              {rows.some((r) => r.uncategorized) && " (including Uncategorized)"}
            </p>
          </div>
        </main>
      </div>

      {/* View details modal */}
      {viewingRow && (
        <Modal title={viewingRow.label} onClose={() => setViewingRow(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Skill type</p>
                <p className="text-sm font-medium text-slate-900">
                  {typeLabel(viewingRow.type)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(viewingRow.status)}`}
                >
                  {viewingRow.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Usage</p>
                <p className="text-sm font-medium text-slate-900">
                  {viewingRow.usage} verification
                  {viewingRow.usage === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 mb-2">Micro skills</p>
              <ul className="space-y-2">
                {viewingRow.skills.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{s.name}</span>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      {s.usage} verified
                      <span className={`px-2 py-0.5 rounded-full font-medium ${statusClasses(s.status)}`}>
                        {s.status}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setViewingRow(null)}
              className="w-full min-h-11 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Add skill modal */}
      {addingSkill && (
        <Modal title="Add skill" onClose={closeModals}>
          <form onSubmit={saveNewSkill} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill name
              </label>
              <input
                value={skillForm.name}
                onChange={(e) =>
                  setSkillForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Docker"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill category
              </label>
              <select
                value={skillForm.category}
                onChange={(e) =>
                  setSkillForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {namedRows.map((r) => (
                  <option key={r.key} value={r.category}>
                    {r.label}
                  </option>
                ))}
                <option value="">{UNCATEGORIZED}</option>
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                The new skill takes this category's type and status.
              </p>
            </div>
            <ErrorText>{modalError}</ErrorText>
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Adding…" : "Add skill"}
            </button>
          </form>
        </Modal>
      )}

      {/* Add / edit / duplicate category modal */}
      {categoryModal && (
        <Modal
          title={
            categoryModal.mode === "edit"
              ? `Edit ${categoryModal.original.label}`
              : categoryModal.mode === "duplicate"
                ? `Duplicate ${categoryModal.original.label}`
                : "Add skill category"
          }
          onClose={closeModals}
        >
          <form onSubmit={saveCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category name
              </label>
              <input
                value={categoryModal.form.category}
                onChange={(e) => updateCategoryForm("category", e.target.value)}
                placeholder="e.g. Cloud infrastructure"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill type
              </label>
              <select
                value={categoryModal.form.type}
                onChange={(e) => updateCategoryForm("type", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">{NOT_SET}</option>
                {SKILL_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={categoryModal.form.status}
                onChange={(e) => updateCategoryForm("status", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Micro skills
              </label>
              <input
                value={categoryModal.form.skillsText}
                onChange={(e) => updateCategoryForm("skillsText", e.target.value)}
                placeholder="Comma-separated, e.g. AWS, Azure, GCP"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                {categoryModal.mode === "edit"
                  ? "Skills you remove are moved to Uncategorized, not deleted."
                  : categoryModal.mode === "duplicate"
                    ? "Skill names are unique, so the copy needs its own skills. Type, status and name are copied."
                    : "Separate each micro skill with a comma."}
              </p>
            </div>

            {moveWarning && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                These skills already belong to another category and will be
                moved here:{" "}
                <span className="font-semibold">
                  {moveWarning
                    .map((s) => `${s.name} (${s.category ?? UNCATEGORIZED})`)
                    .join(", ")}
                </span>
                . Save again to confirm.
              </div>
            )}
            <ErrorText>{modalError}</ErrorText>

            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving
                ? "Saving…"
                : moveWarning
                  ? "Move skills and save"
                  : categoryModal.mode === "edit"
                    ? "Save changes"
                    : "Add skill category"}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deletingRow && (
        <Modal title="Delete skill category" onClose={closeModals}>
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {deletingRow.label}
            </span>{" "}
            and its {deletingRow.skills.length} skill
            {deletingRow.skills.length === 1 ? "" : "s"}? This cannot be
            undone. Skills used by career roles, assessments or verifications
            can't be deleted.
          </p>
          <div className="mb-5">
            <ErrorText>{modalError}</ErrorText>
          </div>
          <div className="flex gap-3">
            <button
              onClick={closeModals}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              {modalError ? "Close" : "Cancel"}
            </button>
            <button
              onClick={confirmDelete}
              disabled={saving || Boolean(modalError)}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? "Deleting…" : "Delete category"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
