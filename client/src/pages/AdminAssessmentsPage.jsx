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

// TODO (backend step): replace with real assessments from the API.
const initialAssessments = [
  {
    name: "Java Programming",
    skill: "Java",
    difficulty: "Intermediate",
    type: "MCQ",
    questions: 20,
    attempts: 1284,
    avg: "78%",
    status: "Active",
    updated: "1 min ago",
  },
  {
    name: "SQL Fundamentals",
    skill: "SQL",
    difficulty: "Intermediate",
    type: "MCQ",
    questions: 15,
    attempts: 964,
    avg: "71%",
    status: "Active",
    updated: "14 hours ago",
  },
  {
    name: "REST API Development",
    skill: "REST APIs",
    difficulty: "Advanced",
    type: "Coding",
    questions: 20,
    attempts: 486,
    avg: "68%",
    status: "Active",
    updated: "1 day ago",
  },
];

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState(initialAssessments);
  const [searchText, setSearchText] = useState("");
  const [skillFilter, setSkillFilter] = useState("Skill");
  const [difficultyFilter, setDifficultyFilter] = useState("Difficulty");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [typeFilter, setTypeFilter] = useState("Assessment type");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);

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

  const skillOptions = ["Skill", ...new Set(assessments.map((a) => a.skill))];
  const difficultyOptions = [
    "Difficulty",
    ...new Set(assessments.map((a) => a.difficulty)),
  ];
  const statusOptions = [
    "Status",
    ...new Set(assessments.map((a) => a.status)),
  ];
  const typeOptions = [
    "Assessment type",
    ...new Set(assessments.map((a) => a.type)),
  ];

  const filtered = assessments.filter((a) => {
    if (searchText && !a.name.toLowerCase().includes(searchText.toLowerCase()))
      return false;
    if (skillFilter !== "Skill" && a.skill !== skillFilter) return false;
    if (difficultyFilter !== "Difficulty" && a.difficulty !== difficultyFilter)
      return false;
    if (statusFilter !== "Status" && a.status !== statusFilter) return false;
    if (typeFilter !== "Assessment type" && a.type !== typeFilter) return false;
    return true;
  });

  function toggleMenu(index) {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  }

  function toggleStatus(index) {
    setAssessments((prev) =>
      prev.map((a, i) =>
        i === index
          ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" }
          : a,
      ),
    );
    setOpenMenuIndex(null);
  }

  function duplicateAssessment(index) {
    setAssessments((prev) => {
      const original = prev[index];
      const copy = {
        ...original,
        name: `${original.name} (copy)`,
        attempts: 0,
        updated: "just now",
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setOpenMenuIndex(null);
  }

  function viewDetails(a) {
    setOpenMenuIndex(null);
    alert(
      `${a.name}\nSkill: ${a.skill}\nDifficulty: ${a.difficulty}\nType: ${a.type}\nQuestions: ${a.questions}\nAttempts: ${a.attempts}\nAverage score: ${a.avg}`,
    );
  }

  function saveEdit(e) {
    e.preventDefault();
    setAssessments((prev) =>
      prev.map((a, i) =>
        i === editingAssessment.index ? { ...editingAssessment.data } : a,
      ),
    );
    setEditingAssessment(null);
  }

  function confirmDelete() {
    setAssessments((prev) =>
      prev.filter((_, i) => i !== deletingAssessment.index),
    );
    setDeletingAssessment(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Assessments
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, manage and monitor technical skill assessments.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/assessments/editor"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Create assessment
            </Link>
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
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total assessments</p>
              <p className="text-3xl font-bold text-slate-900">42</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                ↑ 12.7%
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Active assessments</p>
              <p className="text-3xl font-bold text-slate-900">36</p>
              <p className="text-xs text-slate-500 mt-2">of 42 total</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Completed attempts</p>
              <p className="text-3xl font-bold text-slate-900">8,426</p>
              <p className="text-xs text-slate-500 mt-2">
                Across all assessments
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Average score</p>
              <p className="text-3xl font-bold text-slate-900">74%</p>
              <p className="text-xs text-slate-500 mt-2">
                Across completed attempts
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
                placeholder="Search assessments"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {skillOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {difficultyOptions.map((o) => (
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
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {typeOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Assessment</th>
                  <th className="pb-2 font-semibold">Skill</th>
                  <th className="pb-2 font-semibold">Difficulty</th>
                  <th className="pb-2 font-semibold">Questions</th>
                  <th className="pb-2 font-semibold">Attempts</th>
                  <th className="pb-2 font-semibold">Average</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Last updated</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.name + i} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">
                      {a.name}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">
                        ✓ {a.skill}
                      </span>
                    </td>
                    <td className="text-slate-600">{a.difficulty}</td>
                    <td className="text-slate-900">{a.questions}</td>
                    <td className="text-slate-900">
                      {a.attempts.toLocaleString()}
                    </td>
                    <td className="font-semibold text-slate-900">{a.avg}</td>
                    <td>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          a.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="text-slate-600">{a.updated}</td>
                    <td className="relative">
                      <div className="flex gap-2 text-slate-400">
                        <button
                          onClick={() => toggleMenu(i)}
                          className="hover:text-slate-600"
                        >
                          ⋯
                        </button>
                        <button
                          onClick={() =>
                            setEditingAssessment({ index: i, data: { ...a } })
                          }
                          className="text-primary hover:text-primary-dark"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            setDeletingAssessment({ index: i, name: a.name })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>

                      {openMenuIndex === i && (
                        <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                          <button
                            onClick={() => viewDetails(a)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => duplicateAssessment(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Duplicate assessment
                          </button>
                          <button
                            onClick={() => toggleStatus(i)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {a.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      No assessments match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">
              Showing {filtered.length} of 42 assessments
            </p>
          </div>
        </main>
      </div>

      {/* Edit assessment modal */}
      {editingAssessment && (
        <Modal
          title={`Edit ${editingAssessment.data.name}`}
          onClose={() => setEditingAssessment(null)}
        >
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assessment name
              </label>
              <input
                value={editingAssessment.data.name}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, name: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Skill
              </label>
              <input
                value={editingAssessment.data.skill}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, skill: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Difficulty
              </label>
              <select
                value={editingAssessment.data.difficulty}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, difficulty: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assessment type
              </label>
              <select
                value={editingAssessment.data.type}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, type: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option>MCQ</option>
                <option>Coding</option>
                <option>Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number of questions
              </label>
              <input
                type="number"
                value={editingAssessment.data.questions}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, questions: Number(e.target.value) },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={editingAssessment.data.status}
                onChange={(e) =>
                  setEditingAssessment((prev) => ({
                    ...prev,
                    data: { ...prev.data, status: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
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
      {deletingAssessment && (
        <Modal
          title="Delete assessment"
          onClose={() => setDeletingAssessment(null)}
        >
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {deletingAssessment.name}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingAssessment(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Delete assessment
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
