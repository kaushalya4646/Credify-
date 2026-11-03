// src/pages/AdminSkillsPage.jsx
import { useState } from "react";
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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col">
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

const SKILL_TYPES = ["Technical skill", "Soft skill", "Tool/platform"];
const STATUS_OPTIONS = ["Active", "Draft", "Inactive"];

// TODO (backend step): replace with the real skill taxonomy from the API.
const initialSkillCategories = [
  {
    category: "Programming",
    type: "Technical skill",
    skills: ["Java", "Python"],
    usage: "1,248 candidates",
    status: "Active",
  },
  {
    category: "Database management",
    type: "Technical skill",
    skills: ["SQL", "PostgreSQL"],
    usage: "864 candidates",
    status: "Active",
  },
  {
    category: "API development",
    type: "Technical skill",
    skills: ["REST APIs", "API Testing"],
    usage: "742 candidates",
    status: "Active",
  },
];

function emptyCategoryForm() {
  return {
    category: "",
    type: SKILL_TYPES[0],
    status: "Active",
    skillsText: "",
  };
}

export default function AdminSkillsPage() {
  const [skillCategories, setSkillCategories] = useState(
    initialSkillCategories,
  );
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Skill category");
  const [typeFilter, setTypeFilter] = useState("Skill type");
  const [statusFilter, setStatusFilter] = useState("Status");

  const [addingSkill, setAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: initialSkillCategories[0].category,
  });

  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm());

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // { index, data: { ...row, skillsText } }
  const [deletingCategory, setDeletingCategory] = useState(null); // { index, name }

  const categoryOptions = [
    "Skill category",
    ...new Set(skillCategories.map((c) => c.category)),
  ];
  const typeOptions = [
    "Skill type",
    ...new Set(skillCategories.map((c) => c.type)),
  ];
  const statusOptions = [
    "Status",
    ...new Set(skillCategories.map((c) => c.status)),
  ];

  const filtered = skillCategories.filter((c) => {
    if (
      searchText &&
      !c.category.toLowerCase().includes(searchText.toLowerCase()) &&
      !c.skills.some((s) => s.toLowerCase().includes(searchText.toLowerCase()))
    )
      return false;
    if (categoryFilter !== "Skill category" && c.category !== categoryFilter)
      return false;
    if (typeFilter !== "Skill type" && c.type !== typeFilter) return false;
    if (statusFilter !== "Status" && c.status !== statusFilter) return false;
    return true;
  });

  function parseSkills(text) {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // ---- Add skill ----
  function openAddSkill() {
    setSkillForm({ name: "", category: skillCategories[0]?.category || "" });
    setAddingSkill(true);
  }

  function saveNewSkill(e) {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    setSkillCategories((prev) =>
      prev.map((c) =>
        c.category === skillForm.category
          ? { ...c, skills: [...c.skills, skillForm.name.trim()] }
          : c,
      ),
    );
    setAddingSkill(false);
  }

  // ---- Add skill category ----
  function openAddCategory() {
    setCategoryForm(emptyCategoryForm());
    setAddingCategory(true);
  }

  function saveNewCategory(e) {
    e.preventDefault();
    const newCategory = {
      category: categoryForm.category || "Untitled category",
      type: categoryForm.type,
      status: categoryForm.status,
      skills: parseSkills(categoryForm.skillsText),
      usage: "0 candidates",
    };
    setSkillCategories((prev) => [newCategory, ...prev]);
    setAddingCategory(false);
  }

  // ---- Row actions ----
  function toggleMenu(index) {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  }

  function viewDetails(c) {
    setOpenMenuIndex(null);
    alert(
      `${c.category}\nType: ${c.type}\nMicro skills: ${c.skills.join(", ")}\nUsage: ${c.usage}\nStatus: ${c.status}`,
    );
  }

  function duplicateCategory(index) {
    setSkillCategories((prev) => {
      const original = prev[index];
      const copy = {
        ...original,
        category: `${original.category} (copy)`,
        usage: "0 candidates",
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setOpenMenuIndex(null);
  }

  function toggleStatus(index) {
    setSkillCategories((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c,
      ),
    );
    setOpenMenuIndex(null);
  }

  function openEditCategory(index) {
    const c = skillCategories[index];
    setEditingCategory({
      index,
      data: { ...c, skillsText: c.skills.join(", ") },
    });
    setOpenMenuIndex(null);
  }

  function saveEdit(e) {
    e.preventDefault();
    setSkillCategories((prev) =>
      prev.map((c, i) =>
        i === editingCategory.index
          ? {
              ...editingCategory.data,
              skills: parseSkills(editingCategory.data.skillsText),
            }
          : c,
      ),
    );
    setEditingCategory(null);
  }

  function confirmDelete() {
    setSkillCategories((prev) =>
      prev.filter((_, i) => i !== deletingCategory.index),
    );
    setDeletingCategory(null);
  }

  const totalSkills = skillCategories.reduce(
    (sum, c) => sum + c.skills.length,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Skills</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage the skill taxonomy used across career roles and
              assessments.
            </p>
          </div>
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
        </header>

        <main className="p-10 space-y-6">
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
                {skillCategories.length}
              </p>
              <p className="text-xs text-slate-500 mt-2">Macro skills</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Verified skills</p>
              <p className="text-3xl font-bold text-slate-900">64</p>
              <p className="text-xs text-slate-500 mt-2">74% of all skills</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recently added</p>
              <p className="text-3xl font-bold text-slate-900">7</p>
              <p className="text-xs text-slate-500 mt-2">In the last 30 days</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">Skill structure</h2>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 text-xs text-slate-500 font-semibold">
              <span>Macro skill</span>
              <span>Micro skills</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">
                Database management
              </span>
              <div className="flex gap-2">
                {[
                  "SQL",
                  "PostgreSQL",
                  "Database design",
                  "Query optimization",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
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
                {filtered.map((c, i) => (
                  <tr
                    key={c.category + i}
                    className="border-t border-slate-100"
                  >
                    <td className="py-3 font-semibold text-slate-900">
                      {c.category}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {c.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-slate-600">{c.usage}</td>
                    <td>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : c.status === "Draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="relative">
                      <div className="flex gap-2 text-slate-400">
                        <button
                          onClick={() => toggleMenu(i)}
                          className="hover:text-slate-600"
                        >
                          ⋯
                        </button>
                        <button
                          onClick={() => openEditCategory(i)}
                          className="text-primary hover:text-primary-dark"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            setDeletingCategory({ index: i, name: c.category })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>

                      {openMenuIndex === i && (
                        <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                          <button
                            onClick={() => viewDetails(c)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => duplicateCategory(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Duplicate category
                          </button>
                          <button
                            onClick={() => toggleStatus(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {c.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      No skill categories match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">
              Showing {filtered.length} of {skillCategories.length} categories
            </p>
          </div>
        </main>
      </div>

      {/* Add skill modal */}
      {addingSkill && (
        <Modal title="Add skill" onClose={() => setAddingSkill(false)}>
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
                {skillCategories.map((c) => (
                  <option key={c.category}>{c.category}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                This skill will be added as a micro skill under the chosen
                category.
              </p>
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Add skill
            </button>
          </form>
        </Modal>
      )}

      {/* Add skill category modal */}
      {addingCategory && (
        <Modal
          title="Add skill category"
          onClose={() => setAddingCategory(false)}
        >
          <form onSubmit={saveNewCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category name
              </label>
              <input
                value={categoryForm.category}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                placeholder="e.g. Cloud infrastructure"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill type
              </label>
              <select
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
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
                value={categoryForm.status}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    status: e.target.value,
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
                Micro skills
              </label>
              <input
                value={categoryForm.skillsText}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    skillsText: e.target.value,
                  }))
                }
                placeholder="Comma-separated, e.g. AWS, Azure, GCP"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Separate each micro skill with a comma.
              </p>
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Add skill category
            </button>
          </form>
        </Modal>
      )}

      {/* Edit category modal */}
      {editingCategory && (
        <Modal
          title={`Edit ${editingCategory.data.category}`}
          onClose={() => setEditingCategory(null)}
        >
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category name
              </label>
              <input
                value={editingCategory.data.category}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    data: { ...prev.data, category: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill type
              </label>
              <select
                value={editingCategory.data.type}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    data: { ...prev.data, type: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
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
                value={editingCategory.data.status}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
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
                Micro skills
              </label>
              <input
                value={editingCategory.data.skillsText}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    data: { ...prev.data, skillsText: e.target.value },
                  }))
                }
                placeholder="Comma-separated, e.g. AWS, Azure, GCP"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Separate each micro skill with a comma.
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
      {deletingCategory && (
        <Modal
          title="Delete skill category"
          onClose={() => setDeletingCategory(null)}
        >
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {deletingCategory.name}
            </span>{" "}
            and all its micro skills? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingCategory(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Delete category
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
