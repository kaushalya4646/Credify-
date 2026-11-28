// SavedCandidatesPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Find Candidates", path: "/recruiter/find-candidates" },
  { label: "Create Jobs", path: "/recruiter/jobs/create" },
  { label: "My Jobs", path: "/recruiter/jobs" },
  { label: "Saved Candidates", path: "/recruiter/saved-candidates" },
  { label: "My Profile", path: "/recruiter/profile" },
];

const notifications = [
  {
    title: "New application received",
    detail: "A candidate applied to Backend Engineer",
  },
  {
    title: "Candidate match found",
    detail: "Danee Smith matches 92% for Senior Frontend Engineer",
  },
  {
    title: "Job posting expiring soon",
    detail: "Frontend Engineer posting closes in 3 days",
  },
];

function RecruiterSidebar() {
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
        RECRUITER WORKSPACE
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

// Filter options: value = the API's query value.
const matchOptions = [
  ["90+", "90% and above"],
  ["80-89", "80%–89%"],
  ["70-79", "70%–79%"],
  ["below70", "Below 70%"],
];
const experienceOptions = [
  ["0-1", "0–1 years"],
  ["2-3", "2–3 years"],
  ["4-5", "4–5 years"],
  ["5+", "5+ years"],
];
const verificationOptions = [
  ["verified", "Verified"],
  ["notVerified", "Not verified"],
];
const dateSavedOptions = [
  ["today", "Today"],
  ["thisWeek", "This week"],
  ["thisMonth", "This month"],
];
const sortOptions = [
  ["recentlySaved", "Recently saved"],
  ["highestMatch", "Highest match"],
  ["nameAsc", "Name A–Z"],
];

const defaultFilters = {
  careerRole: "",
  skill: "",
  matchBucket: "",
  experienceBucket: "",
  verification: "",
  dateSavedBucket: "",
};

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function experienceText(years) {
  if (years == null) return "Experience not given";
  return `${years} year${years === 1 ? "" : "s"} experience`;
}

export default function SavedCandidatesPage() {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("recentlySaved");
  const [view, setView] = useState("card");
  const [filters, setFilters] = useState(defaultFilters);
  const [careerRoles, setCareerRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [contactCandidate, setContactCandidate] = useState(null);
  const latestRequest = useRef(0);

  // which header dropdown is open: 'help' | 'notifications' | 'profile' | null
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

  // Filter dropdown options: the real career roles and skills.
  useEffect(() => {
    api.get("/api/career-roles")
      .then((list) => setCareerRoles([...(list || [])].sort((a, b) => a.name.localeCompare(b.name))))
      .catch((err) => console.error("Failed to load career roles:", err));
    api.get("/api/skills")
      .then((list) => setSkills((list || []).filter((s) => s.status === "Active").sort((a, b) => a.name.localeCompare(b.name))))
      .catch((err) => console.error("Failed to load skills:", err));
  }, []);

  async function load() {
    const requestId = ++latestRequest.current;
    const params = new URLSearchParams({ sort });
    if (searchText.trim()) params.set("q", searchText.trim());
    for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
    try {
      const data = await api.get(`/api/saved-candidates?${params}`);
      if (requestId !== latestRequest.current) return; // a newer request is on its way
      setCandidates(data.candidates);
      setStats(data.stats);
      setError("");
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(err.message || "Could not load saved candidates.");
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  // Refetch whenever the search (debounced), sort or a filter changes.
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, sort, filters]);

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setSearchText("");
    setSort("recentlySaved");
  }

  async function removeSaved(c) {
    setActionError("");
    // Gone from the list straight away; the counts refresh after the server confirms.
    setCandidates((list) => list.filter((x) => x.candidateUserId !== c.candidateUserId));
    try {
      await api.delete(`/api/saved-candidates/${c.candidateUserId}`);
    } catch (err) {
      setActionError(err.message || `Could not remove ${c.user.name}.`);
    }
    load();
  }

  // Runs alongside the mailto link opening; never blocks it.
  function markContacted(c) {
    api
      .post(`/api/saved-candidates/${c.candidateUserId}/contacted`)
      .then(load)
      .catch((err) => console.error("Failed to mark as contacted:", err));
  }

  const anyFilter = Boolean(searchText.trim()) || Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Saved Candidates
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and manage candidates you have saved for potential
              recruitment.
            </p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            <Link
              to="/recruiter/find-candidates"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Find candidates
            </Link>

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
                <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/help-center"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Visit help center
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    to="/terms-of-service"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Terms of service
                  </Link>
                  <Link
                    to="/about-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    About us
                  </Link>
                  <Link
                    to="/feedback"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Give feedback about Credify
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
                  MP
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  M Perera
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
                    to="/recruiter/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
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
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {[
              ["Saved Candidates", stats?.total, "in your saved list"],
              ["High Match", stats?.highMatch, stats && stats.highMatch == null ? "Candidate matching is off" : "80% match or above"],
              ["Recently Added", stats?.recentlyAdded, "in the last 7 days"],
              ["Contacted", stats?.contacted, "emailed from Credify"],
            ].map(([label, value, sub]) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value ?? "—"}</p>
                <p className="text-xs text-slate-500 mt-2">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name, career role or skill"
                aria-label="Search saved candidates"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                {sortOptions.map(([v, label]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden">
                <button
                  onClick={() => setView("card")}
                  aria-pressed={view === "card"}
                  className={`px-4 py-2.5 text-sm font-semibold ${view === "card" ? "bg-blue-50 text-primary" : "text-slate-600"}`}
                >
                  Card view
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`px-4 py-2.5 text-sm font-semibold ${view === "list" ? "bg-blue-50 text-primary" : "text-slate-600"}`}
                >
                  List view
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 border-t border-slate-100 pt-5">
              <div className="flex gap-3 flex-wrap">
                {[
                  ["careerRole", "Career role", careerRoles.map((r) => [r.id, r.name])],
                  ["skill", "Skill", skills.map((s) => [s.id, s.name])],
                  ["matchBucket", "Match percentage", matchOptions],
                  ["experienceBucket", "Experience", experienceOptions],
                  ["verification", "Verification status", verificationOptions],
                  ["dateSavedBucket", "Date saved", dateSavedOptions],
                ].map(([field, label, options]) => (
                  <select
                    key={field}
                    value={filters[field]}
                    onChange={(e) => updateFilter(field, e.target.value)}
                    aria-label={label}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                  >
                    <option value="">{field === "dateSavedBucket" ? "Date saved: All time" : label}</option>
                    {options.map(([v, text]) => (
                      <option key={v} value={v}>{text}</option>
                    ))}
                  </select>
                ))}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary"
              >
                Clear filters
              </button>
            </div>

            {actionError && (
              <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </p>
            )}

            {loading ? (
              <p className="text-center text-sm text-slate-500 py-10">Loading saved candidates…</p>
            ) : error ? (
              <p className="text-center text-sm text-red-600 py-10">{error}</p>
            ) : candidates.length === 0 ? (
              stats?.total === 0 && !anyFilter ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-slate-500">You haven't saved any candidates yet.</p>
                  <Link to="/recruiter/find-candidates" className="text-sm font-semibold text-primary hover:underline">
                    Find candidates to save
                  </Link>
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 py-10">
                  No saved candidates match these filters.
                </p>
              )
            ) : view === "card" ? (
              <div className="grid grid-cols-3 gap-6">
                {candidates.map((c) => (
                  <div
                    key={c.candidateUserId}
                    data-candidate-id={c.candidateUserId}
                    className="border border-slate-200 rounded-2xl p-5 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-primary">
                        {initials(c.user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to={`/recruiter/candidates/${c.candidateUserId}`} className="font-semibold text-slate-900 hover:text-primary">
                          {c.user.name}
                        </Link>
                        <p className="text-xs text-slate-500">{c.targetCareerRole?.name || "No target role selected"}</p>
                      </div>
                      {"match" in c && c.match != null && (
                        <div className="text-right shrink-0">
                          <p className="font-bold text-green-700">{c.match}%</p>
                          <p className="text-[11px] text-slate-500">Match</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-3">📅 {experienceText(c.experienceYears)}</p>
                    {c.verified && (
                      <span className="self-start mb-3 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        ✓ Verified Profile
                      </span>
                    )}
                    <div className="border-t border-slate-100 pt-3 mb-3">
                      <p className="text-xs text-slate-500 mb-2">Top skills</p>
                      {c.topSkills.length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                          {c.topSkills.slice(0, 4).map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No verified skills yet</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1 border-t border-slate-100 pt-3">
                      <span className="text-slate-500">
                        Latest assessment{c.latestAssessment ? ` (${c.latestAssessment.skillName})` : ""}
                      </span>
                      <span className="font-bold text-slate-900">
                        {c.latestAssessment ? `${c.latestAssessment.score}%` : "—"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Saved {formatDate(c.savedAt)}</p>
                    <p className="text-xs text-slate-500 mb-3">
                      {c.contactedAt ? `Contacted ${formatDate(c.contactedAt)}` : "Not contacted yet"}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setContactCandidate(c)}
                        className="flex-1 py-2 rounded-xl border border-primary text-primary text-sm font-semibold"
                      >
                        Contact
                      </button>
                      <button
                        onClick={() => removeSaved(c)}
                        className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold"
                      >
                        Remove saved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {candidates.map((c) => (
                  <div key={c.candidateUserId} data-candidate-id={c.candidateUserId} className="flex items-center gap-4 p-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-primary">
                      {initials(c.user.name)}
                    </div>
                    <div className="w-48 shrink-0">
                      <Link to={`/recruiter/candidates/${c.candidateUserId}`} className="font-semibold text-slate-900 text-sm hover:text-primary">
                        {c.user.name}
                      </Link>
                      <p className="text-xs text-slate-500">{c.targetCareerRole?.name || "No target role selected"}</p>
                    </div>
                    <p className="text-sm text-slate-600 w-36 shrink-0">{experienceText(c.experienceYears)}</p>
                    <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                      {c.topSkills.slice(0, 4).map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    {"match" in c && (
                      <div className="text-center w-16 shrink-0">
                        <p className="font-bold text-green-700 text-sm">{c.match != null ? `${c.match}%` : ""}</p>
                        <p className="text-[11px] text-slate-500">{c.match != null ? "Match" : ""}</p>
                      </div>
                    )}
                    <div className="text-center w-20 shrink-0">
                      <p className="font-bold text-slate-900 text-sm">{c.latestAssessment ? `${c.latestAssessment.score}%` : "—"}</p>
                      <p className="text-[11px] text-slate-500">Latest score</p>
                    </div>
                    {c.verified && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        ✓ Verified
                      </span>
                    )}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setContactCandidate(c)}
                        className="px-4 py-2 rounded-lg border border-primary text-primary text-xs font-semibold"
                      >
                        Contact
                      </button>
                      <button
                        onClick={() => removeSaved(c)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Contact candidate modal: email only. */}
      {contactCandidate && (
        <Modal
          title={`Contact ${contactCandidate.user.name}`}
          onClose={() => setContactCandidate(null)}
        >
          <a
            href={`mailto:${contactCandidate.user.email}`}
            onClick={() => markContacted(contactCandidate)}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              ✉️
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="text-xs text-slate-500">{contactCandidate.user.email}</p>
            </div>
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Opens your email app. The candidate is marked as contacted.
          </p>
        </Modal>
      )}
    </div>
  );
}
