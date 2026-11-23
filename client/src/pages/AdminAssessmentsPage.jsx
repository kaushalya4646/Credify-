import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const ASSESSMENT_TYPES = ["MCQ", "Mixed", "Written"];
const STATUSES = ["Draft", "Active", "Inactive"];

function statusClasses(status) {
  if (status === "Active") return "bg-green-50 text-green-700";
  if (status === "Draft") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function formatScore(score) {
  return score == null ? "—" : `${score}%`;
}

function timeAgo(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["min", 60],
  ];
  for (const [name, size] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n === 1 ? "" : "s"} ago`;
  }
  return "just now";
}

// Empty strings from number inputs become null; anything else a whole number.
function toOptionalInt(value) {
  if (value === "" || value == null) return null;
  return Number(value);
}

function emptyCreateForm(skills) {
  return {
    title: "",
    skillId: skills[0]?.id ?? "",
    difficulty: DIFFICULTIES[0],
    type: ASSESSMENT_TYPES[0],
    durationMinutes: "",
  };
}

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}

export default function AdminAssessmentsPage() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState(""); // page-level error from row actions

  const [searchText, setSearchText] = useState("");
  const [skillFilter, setSkillFilter] = useState("Skill");
  const [difficultyFilter, setDifficultyFilter] = useState("Difficulty");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [typeFilter, setTypeFilter] = useState("Assessment type");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [creating, setCreating] = useState(null); // create form | null
  const [editing, setEditing] = useState(null); // { id, data } | null
  const [deleting, setDeleting] = useState(null); // assessment | null
  const [viewing, setViewing] = useState(null); // assessment | null
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

  async function loadAssessments() {
    try {
      setAssessments((await api.get("/api/assessments")) || []);
      setLoadError("");
    } catch (err) {
      console.error("Failed to load assessments:", err);
      setLoadError(err.message || "Could not load assessments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssessments();
    api
      .get("/api/skills")
      .then((data) => setSkills(data || []))
      .catch((err) => console.error("Failed to load skills:", err));
  }, []);

  // ---- Stats (all computed from the admin list, which includes every status) ----
  const total = assessments.length;
  const activeCount = assessments.filter((a) => a.status === "Active").length;
  const totalAttempts = assessments.reduce((sum, a) => sum + (a.attemptsCount || 0), 0);
  // Weighted by each assessment's attempt count; null until anyone has a score.
  const scored = assessments.filter((a) => a.avgScore != null && a.attemptsCount > 0);
  const scoredAttempts = scored.reduce((sum, a) => sum + a.attemptsCount, 0);
  const overallAvg = scoredAttempts
    ? Math.round(scored.reduce((sum, a) => sum + a.avgScore * a.attemptsCount, 0) / scoredAttempts)
    : null;

  // ---- Filters ----
  const skillName = (a) => a.skill?.name ?? "—";
  const skillOptions = ["Skill", ...new Set(assessments.map(skillName))];
  const difficultyOptions = ["Difficulty", ...new Set(assessments.map((a) => a.difficulty))];
  const statusOptions = ["Status", ...new Set(assessments.map((a) => a.status))];
  const typeOptions = ["Assessment type", ...new Set(assessments.map((a) => a.type))];

  const search = searchText.trim().toLowerCase();
  const filtered = assessments.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search)) return false;
    if (skillFilter !== "Skill" && skillName(a) !== skillFilter) return false;
    if (difficultyFilter !== "Difficulty" && a.difficulty !== difficultyFilter) return false;
    if (statusFilter !== "Status" && a.status !== statusFilter) return false;
    if (typeFilter !== "Assessment type" && a.type !== typeFilter) return false;
    return true;
  });

  function closeModals() {
    setCreating(null);
    setEditing(null);
    setDeleting(null);
    setModalError("");
  }

  // ---- Create ----
  function openCreate() {
    setModalError("");
    setCreating(emptyCreateForm(skills));
  }

  async function saveCreate(e) {
    e.preventDefault();
    if (!creating.title.trim()) return setModalError("Enter a title.");
    if (!creating.skillId) return setModalError("Choose a skill.");
    const durationMinutes = toOptionalInt(creating.durationMinutes);
    if (durationMinutes != null && (!Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
      return setModalError("Duration must be a whole number of minutes.");
    }
    setSaving(true);
    setModalError("");
    try {
      // New assessments are created as Draft; questions are added in the editor.
      const created = await api.post("/api/assessments", {
        title: creating.title.trim(),
        skillId: creating.skillId,
        difficulty: creating.difficulty,
        type: creating.type,
        durationMinutes,
      });
      navigate(`/admin/assessments/editor/${created.id}`);
    } catch (err) {
      setModalError(err.message);
      setSaving(false);
    }
  }

  // ---- Edit ----
  function openEdit(a) {
    setOpenMenuId(null);
    setModalError("");
    setEditing({
      id: a.id,
      questionCount: a._count?.questions ?? 0,
      data: {
        title: a.title,
        description: a.description ?? "",
        skillId: a.skillId,
        difficulty: a.difficulty,
        type: a.type,
        durationMinutes: a.durationMinutes ?? "",
        passingScore: a.passingScore,
        status: a.status,
      },
    });
  }

  function updateEdit(field, value) {
    setEditing((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  }

  async function saveEdit(e) {
    e.preventDefault();
    const d = editing.data;
    const durationMinutes = toOptionalInt(d.durationMinutes);
    const passingScore = Number(d.passingScore);
    if (!d.title.trim()) return setModalError("Enter a title.");
    if (durationMinutes != null && (!Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
      return setModalError("Duration must be a whole number of minutes.");
    }
    if (!Number.isInteger(passingScore) || passingScore < 0 || passingScore > 100) {
      return setModalError("Passing score must be a whole number from 0 to 100.");
    }
    if (d.status === "Active" && editing.questionCount === 0) {
      return setModalError("Add at least one question in the editor before making this assessment Active.");
    }
    setSaving(true);
    setModalError("");
    try {
      await api.put(`/api/assessments/${editing.id}`, {
        title: d.title.trim(),
        description: d.description.trim() || null,
        skillId: d.skillId,
        difficulty: d.difficulty,
        type: d.type,
        durationMinutes,
        passingScore,
        status: d.status,
      });
      closeModals();
      await loadAssessments();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---- Row actions ----
  function toggleMenu(id) {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }

  function viewDetails(a) {
    setOpenMenuId(null);
    setViewing(a);
  }

  async function duplicateAssessment(a) {
    setOpenMenuId(null);
    setNotice("");
    try {
      await api.post(`/api/assessments/${a.id}/duplicate`, {});
      await loadAssessments();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function toggleStatus(a) {
    setOpenMenuId(null);
    setNotice("");
    const status = a.status === "Active" ? "Inactive" : "Active";
    if (status === "Active" && (a._count?.questions ?? 0) === 0) {
      setNotice(`"${a.title}" has no questions yet. Add questions in the editor before activating it.`);
      return;
    }
    try {
      await api.put(`/api/assessments/${a.id}`, { status });
      await loadAssessments();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function confirmDelete() {
    setSaving(true);
    setModalError("");
    try {
      await api.delete(`/api/assessments/${deleting.id}`);
      closeModals();
      await loadAssessments();
    } catch (err) {
      // Shows the backend's "candidates have already attempted it" message on 409.
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
            <h1 className="text-2xl font-semibold text-slate-900">
              Assessments
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, manage and monitor technical skill assessments.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreate}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Create assessment
            </button>
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
              <p className="text-sm text-slate-500 mb-2">Total assessments</p>
              <p className="text-3xl font-bold text-slate-900">{total}</p>
              <p className="text-xs text-slate-500 mt-2">All statuses</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Active assessments</p>
              <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
              <p className="text-xs text-slate-500 mt-2">of {total} total</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Completed attempts</p>
              <p className="text-3xl font-bold text-slate-900">
                {totalAttempts.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Across all assessments
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Average score</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatScore(overallAvg)}
              </p>
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
                {loading && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-slate-500">
                      Loading assessments…
                    </td>
                  </tr>
                )}
                {!loading && loadError && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-red-600">
                      {loadError}
                    </td>
                  </tr>
                )}
                {!loading &&
                  !loadError &&
                  filtered.map((a) => (
                    <tr key={a.id} className="border-t border-slate-100">
                      <td className="py-3 pr-3">
                        <Link
                          to={`/admin/assessments/editor/${a.id}`}
                          className="font-semibold text-slate-900 hover:text-primary hover:underline"
                        >
                          {a.title}
                        </Link>
                        <p className="text-xs text-slate-500">{a.type}</p>
                      </td>
                      <td className="pr-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">
                          ✓ {skillName(a)}
                        </span>
                      </td>
                      <td className="text-slate-600">{a.difficulty}</td>
                      <td className="text-slate-900">{a._count?.questions ?? 0}</td>
                      <td className="text-slate-900">
                        {(a.attemptsCount ?? 0).toLocaleString()}
                      </td>
                      <td
                        className={`font-semibold ${a.avgScore == null ? "text-slate-400" : "text-slate-900"}`}
                      >
                        {formatScore(a.avgScore)}
                      </td>
                      <td>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(a.status)}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="text-slate-600" title={new Date(a.updatedAt).toLocaleString()}>
                        {timeAgo(a.updatedAt)}
                      </td>
                      <td className="relative">
                        <div className="flex gap-2 text-slate-400">
                          <button
                            onClick={() => toggleMenu(a.id)}
                            className="hover:text-slate-600"
                            aria-label={`More actions for ${a.title}`}
                          >
                            ⋯
                          </button>
                          <button
                            onClick={() => openEdit(a)}
                            className="text-primary hover:text-primary-dark"
                            aria-label={`Edit ${a.title}`}
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => {
                              setModalError("");
                              setDeleting(a);
                            }}
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Delete ${a.title}`}
                          >
                            ✕
                          </button>
                        </div>

                        {openMenuId === a.id && (
                          <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                            <button
                              onClick={() => viewDetails(a)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              View details
                            </button>
                            <button
                              onClick={() => navigate(`/admin/assessments/editor/${a.id}`)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Edit questions
                            </button>
                            <button
                              onClick={() => duplicateAssessment(a)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Duplicate assessment
                            </button>
                            <button
                              onClick={() => toggleStatus(a)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              {a.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                {!loading && !loadError && filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      {total === 0
                        ? "No assessments yet. Create one to get started."
                        : "No assessments match these filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">
              Showing {filtered.length} of {total} assessment{total === 1 ? "" : "s"}
            </p>
          </div>
        </main>
      </div>

      {/* View details modal */}
      {viewing && (
        <Modal title={viewing.title} onClose={() => setViewing(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Skill</p>
                <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">
                  ✓ {skillName(viewing)}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Difficulty</p>
                <p className="text-sm font-medium text-slate-900">{viewing.difficulty}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Type</p>
                <p className="text-sm font-medium text-slate-900">{viewing.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(viewing.status)}`}
                >
                  {viewing.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Questions</p>
                <p className="text-sm font-medium text-slate-900">{viewing._count?.questions ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Attempts</p>
                <p className="text-sm font-medium text-slate-900">
                  {(viewing.attemptsCount ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Average score</p>
                <p className="text-sm font-semibold text-slate-900">{formatScore(viewing.avgScore)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Passing score</p>
                <p className="text-sm font-medium text-slate-900">{viewing.passingScore}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="text-sm font-medium text-slate-900">
                  {viewing.durationMinutes ? `${viewing.durationMinutes} mins` : "No time limit"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Last updated</p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(viewing.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewing(null)}
              className="w-full min-h-11 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Create assessment modal */}
      {creating && (
        <Modal title="Create assessment" onClose={closeModals}>
          <form onSubmit={saveCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
              <input
                value={creating.title}
                onChange={(e) => setCreating((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. SQL Fundamentals"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Skill</label>
              <select
                value={creating.skillId}
                onChange={(e) => setCreating((p) => ({ ...p, skillId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {skills.length === 0 && <option value="">No skills available</option>}
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.status !== "Active" ? ` (${s.status})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Difficulty</label>
                <select
                  value={creating.difficulty}
                  onChange={(e) => setCreating((p) => ({ ...p, difficulty: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                <select
                  value={creating.type}
                  onChange={(e) => setCreating((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                >
                  {ASSESSMENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={creating.durationMinutes}
                onChange={(e) => setCreating((p) => ({ ...p, durationMinutes: e.target.value }))}
                placeholder="Leave blank for no time limit"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <p className="text-xs text-slate-500">
              The assessment is created as a Draft. You'll add questions and publish it in the editor next.
            </p>
            <ErrorText>{modalError}</ErrorText>
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create and add questions"}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit assessment modal */}
      {editing && (
        <Modal title={`Edit ${editing.data.title || "assessment"}`} onClose={closeModals}>
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assessment name</label>
              <input
                value={editing.data.title}
                onChange={(e) => updateEdit("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                value={editing.data.description}
                onChange={(e) => updateEdit("description", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Skill</label>
              <select
                value={editing.data.skillId}
                onChange={(e) => updateEdit("skillId", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.status !== "Active" ? ` (${s.status})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Difficulty</label>
                <select
                  value={editing.data.difficulty}
                  onChange={(e) => updateEdit("difficulty", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                >
                  {[...new Set([...DIFFICULTIES, editing.data.difficulty])].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assessment type</label>
                <select
                  value={editing.data.type}
                  onChange={(e) => updateEdit("type", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                >
                  {[...new Set([...ASSESSMENT_TYPES, editing.data.type])].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Duration (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={editing.data.durationMinutes}
                  onChange={(e) => updateEdit("durationMinutes", e.target.value)}
                  placeholder="No limit"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Passing score (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.data.passingScore}
                  onChange={(e) => updateEdit("passingScore", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                value={editing.data.status}
                onChange={(e) => updateEdit("status", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <ErrorText>{modalError}</ErrorText>
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deleting && (
        <Modal title="Delete assessment" onClose={closeModals}>
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{deleting.title}</span>{" "}
            and its {deleting._count?.questions ?? 0} question
            {(deleting._count?.questions ?? 0) === 1 ? "" : "s"}? This cannot be undone.
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
              {saving ? "Deleting…" : "Delete assessment"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
