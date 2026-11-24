import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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

// "Available reports" -> the section of this page each one points at.
const availableReports = [
  { label: "User activity", target: "stats" },
  { label: "Assessment performance", target: "passRate" },
  { label: "Career role trends", target: "roles" },
  { label: "Skill verification trends", target: "distribution" },
  { label: "Recruiter activity", target: "recruiters" },
];

const RANGE_OPTIONS = [
  ["7", "Last 7 days"],
  ["14", "Last 14 days"],
  ["30", "Last 30 days"],
];

function formatNumber(n) {
  return Number(n ?? 0).toLocaleString();
}

function formatPct(n) {
  return n == null ? "—" : `${n}%`;
}

// Quote a CSV field when it contains a comma, quote or line break.
function csvField(value) {
  const s = value == null ? "" : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminReportsPage() {
  const [openMenu, setOpenMenu] = useState(null); // 'help' | 'notifications' | 'profile' | null
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

  // ---- Filters (options come from the API) ----
  const [filters, setFilters] = useState({ range: "30", userType: "", careerRoleId: "", skillCategory: "" });
  const [careerRoles, setCareerRoles] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);

  useEffect(() => {
    api
      .get("/api/career-roles")
      .then((roles) => setCareerRoles((roles || []).sort((a, b) => a.name.localeCompare(b.name))))
      .catch((err) => console.error("Failed to load career roles:", err));
    api
      .get("/api/skills")
      .then((skills) =>
        setSkillCategories([...new Set((skills || []).map((s) => s.category).filter(Boolean))].sort()),
      )
      .catch((err) => console.error("Failed to load skills:", err));
  }, []);

  // ---- Report data: refetched whenever a filter changes ----
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams({ range: filters.range });
    if (filters.userType) params.set("userType", filters.userType);
    if (filters.careerRoleId) params.set("careerRoleId", filters.careerRoleId);
    if (filters.skillCategory) params.set("skillCategory", filters.skillCategory);
    // Ignore a slower, older response that arrives after a newer one.
    const requestId = ++latestRequest.current;
    setLoading(true);
    api
      .get(`/api/admin/reports?${params}`)
      .then((data) => {
        if (requestId !== latestRequest.current) return;
        setReport(data);
        setError("");
      })
      .catch((err) => {
        if (requestId !== latestRequest.current) return;
        console.error("Failed to load reports:", err);
        setError(err.message || "Could not load reports.");
      })
      .finally(() => {
        if (requestId === latestRequest.current) setLoading(false);
      });
  }, [filters]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  // ---- "Available reports": scroll to and briefly highlight a section ----
  const sectionRefs = {
    stats: useRef(null),
    passRate: useRef(null),
    roles: useRef(null),
    distribution: useRef(null),
    recruiters: useRef(null),
  };
  const [highlighted, setHighlighted] = useState(null);
  const highlightTimer = useRef(null);

  function showSection(target) {
    sectionRefs[target].current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlighted(target);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlighted(null), 1600);
  }
  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const highlightClass = (target) =>
    highlighted === target ? "ring-2 ring-primary ring-offset-2 bg-blue-50 transition-colors" : "transition-colors";

  // ---- Export the numbers currently on screen as CSV ----
  function exportCsv() {
    if (!report) return;
    const roleName = careerRoles.find((r) => r.id === filters.careerRoleId)?.name;
    const rangeLabel = RANGE_OPTIONS.find(([v]) => v === filters.range)?.[1];
    const dist = report.skillVerificationDistribution;
    const rows = [
      ["Credify report", new Date().toLocaleString()],
      ["Date range", rangeLabel],
      ["User type", filters.userType || "All"],
      ["Career role", roleName || "All"],
      ["Skill category", filters.skillCategory || "All"],
      [],
      ["Metric", "Value"],
      ["Total users (new in range)", report.totalUsers],
      ["Assessments completed", report.assessmentsCompleted],
      ["Pass rate (%)", report.passRatePct ?? "n/a"],
      ["Skills verified", report.skillsVerified],
      ["Verification rate (%)", report.verificationRatePct ?? "n/a"],
      ["Recruiters", report.recruitersCount],
      ["Verified skills share (%)", dist ? dist.verifiedPct : "n/a"],
      ["Unverified skills share (%)", dist ? dist.unverifiedPct : "n/a"],
      [],
      ["Popular career roles"],
      ["Career role", "Candidates"],
      ...report.popularCareerRoles.map((r) => [r.name, r.count]),
    ];
    const csv = rows.map((r) => r.map(csvField).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credify-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const dist = report?.skillVerificationDistribution;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Reports and analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor platform activity, skill verification and recruitment
              trends.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={exportCsv}
              disabled={!report}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              Export report
            </button>
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
                    <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-4">
            <select
              aria-label="Date range"
              value={filters.range}
              onChange={(e) => setFilter("range", e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            >
              {RANGE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              aria-label="User type"
              value={filters.userType}
              onChange={(e) => setFilter("userType", e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            >
              <option value="">All user types</option>
              <option value="Candidate">Candidate</option>
              <option value="Recruiter">Recruiter</option>
            </select>
            <select
              aria-label="Career role"
              value={filters.careerRoleId}
              onChange={(e) => setFilter("careerRoleId", e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            >
              <option value="">All career roles</option>
              {careerRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              aria-label="Skill category"
              value={filters.skillCategory}
              onChange={(e) => setFilter("skillCategory", e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            >
              <option value="">All skill categories</option>
              {skillCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {loading && report && <span className="self-center text-xs text-slate-400">Updating…</span>}
          </div>

          {!report && loading && <p className="py-10 text-center text-sm text-slate-500">Loading reports…</p>}
          {error && <p className="py-4 text-center text-sm text-red-600">{error}</p>}

          {report && (
            <>
              <div ref={sectionRefs.stats} className={`grid grid-cols-4 gap-6 rounded-2xl ${highlightClass("stats")}`}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500 mb-2">Total users</p>
                  <p className="text-3xl font-bold text-slate-900">{formatNumber(report.totalUsers)}</p>
                  <p className="text-xs text-slate-500 mt-2">New in the selected period</p>
                </div>
                <div ref={sectionRefs.passRate} className={`bg-white rounded-2xl border border-slate-200 p-6 ${highlightClass("passRate")}`}>
                  <p className="text-sm text-slate-500 mb-2">Assessments completed</p>
                  <p className="text-3xl font-bold text-slate-900">{formatNumber(report.assessmentsCompleted)}</p>
                  <p className="text-xs text-slate-500 mt-2">Pass rate {formatPct(report.passRatePct)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500 mb-2">Skills verified</p>
                  <p className="text-3xl font-bold text-slate-900">{formatNumber(report.skillsVerified)}</p>
                  <p className="text-xs text-slate-500 mt-2">Verification rate {formatPct(report.verificationRatePct)}</p>
                </div>
                <div ref={sectionRefs.recruiters} className={`bg-white rounded-2xl border border-slate-200 p-6 ${highlightClass("recruiters")}`}>
                  <p className="text-sm text-slate-500 mb-2">Recruiters</p>
                  <p className="text-3xl font-bold text-slate-900">{formatNumber(report.recruitersCount)}</p>
                  <p className="text-xs text-slate-500 mt-2">All time</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div ref={sectionRefs.roles} className={`bg-white rounded-2xl border border-slate-200 p-6 ${highlightClass("roles")}`}>
                  <h3 className="font-medium text-slate-900 mb-1">Popular career roles</h3>
                  <p className="text-sm text-slate-500 mb-4">Career role selections</p>
                  <div className="space-y-3">
                    {report.popularCareerRoles.map((r) => (
                      <div key={r.name}>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>{r.name}</span>
                          <span className="font-semibold text-slate-900">{r.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    ))}
                    {report.popularCareerRoles.length === 0 && (
                      <p className="text-sm text-slate-400">No career role selections yet.</p>
                    )}
                  </div>
                </div>

                <div ref={sectionRefs.distribution} className={`bg-white rounded-2xl border border-slate-200 p-6 ${highlightClass("distribution")}`}>
                  <h3 className="font-medium text-slate-900 mb-1">Skill verification distribution</h3>
                  <p className="text-sm text-slate-500 mb-4">Verified vs unverified skills</p>
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke={dist ? "#d5dbe6" : "#eef1f5"} strokeWidth="14" />
                        {/* No arc for no data or 0% (a round cap would still draw a dot) */}
                        {dist && dist.verifiedPct > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="14"
                            strokeLinecap={dist.verifiedPct >= 100 ? "butt" : "round"}
                            strokeDasharray={`${circumference * (dist.verifiedPct / 100)} ${circumference}`}
                          />
                        )}
                      </svg>
                      <span className={`absolute text-xl font-bold ${dist ? "text-slate-900" : "text-slate-400"}`}>
                        {dist ? `${dist.verifiedPct}%` : "—"}
                      </span>
                    </div>
                    {dist ? (
                      <div className="mt-4 space-y-2 w-full text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-primary" /> Verified — {dist.verifiedPct}% of skills
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-slate-300" /> Unverified — {dist.unverifiedPct}% of skills
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400">No skill verifications yet.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-medium text-slate-900 mb-4">Available reports</h3>
                  <div className="space-y-1">
                    {availableReports.map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => showSection(r.target)}
                        className="w-full flex items-center justify-between py-3 border-b border-slate-100 last:border-0 text-sm font-medium text-slate-900 hover:text-primary"
                      >
                        {r.label} <span className="text-slate-400">›</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
