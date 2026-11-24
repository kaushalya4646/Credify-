// FindCandidatesPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Find Candidates", path: "/recruiter/find-candidates" },
  { label: "Create Jobs", path: "/recruiter/jobs/create" },
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
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
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

// Each filter maps to a query param on GET /api/recruiter/candidates.
const filters = [
  { label: "Career role", param: "careerRoleId" },
  { label: "Verified skills", param: "skillId" },
];

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Highest match first; candidates with no match (null) go last.
function sortByMatch(list) {
  return [...list].sort((a, b) => {
    if (a.match == null && b.match == null) return 0;
    if (a.match == null) return 1;
    if (b.match == null) return -1;
    return b.match - a.match;
  });
}

function formatMatch(match) {
  return match == null ? "—" : `${match}%`;
}

function MatchRing({ match }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#e5e9f0"
          strokeWidth="9"
        />
        {/* Skip the arc at 0% — a round line cap would still draw a dot. */}
        {match != null && match > 0 && (
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#16a34a"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${c * (match / 100)} ${c}`}
          />
        )}
      </svg>
      <span
        className={`absolute text-lg font-bold ${match == null ? "text-slate-400" : "text-slate-900"}`}
      >
        {formatMatch(match)}
      </span>
    </div>
  );
}

export default function FindCandidatesPage() {
  const [searchText, setSearchText] = useState("");
  const [exploreOpen, setExploreOpen] = useState(false);

  // Filter options + current selections ({ careerRoleId, skillId }).
  const [careerRoles, setCareerRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState({ careerRoleId: "", skillId: "" });
  const [openFilter, setOpenFilter] = useState(null);
  const filterRef = useRef(null);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  async function runSearch(text, sel) {
    const params = new URLSearchParams();
    if (text.trim()) params.set("q", text.trim());
    if (sel.careerRoleId) params.set("careerRoleId", sel.careerRoleId);
    if (sel.skillId) params.set("skillId", sel.skillId);
    const qs = params.toString();

    // Ignore responses from older searches that finish after a newer one.
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError("");
    try {
      const data = await api.get(
        `/api/recruiter/candidates${qs ? `?${qs}` : ""}`,
      );
      if (requestId === latestRequest.current) {
        setCandidates(sortByMatch(data || []));
      }
    } catch (err) {
      console.error("Candidate search failed:", err);
      if (requestId === latestRequest.current) {
        setError(err.message || "Could not search candidates.");
        setCandidates([]);
      }
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  // Load filter options and an initial, unfiltered search.
  useEffect(() => {
    api
      .get("/api/career-roles")
      .then((data) => setCareerRoles(data || []))
      .catch((err) => console.error("Failed to load career roles:", err));
    api
      .get("/api/skills")
      // Only offer Active skills (the API already filters these for recruiters).
      .then((data) => setSkills((data || []).filter((s) => s.status === "Active")))
      .catch((err) => console.error("Failed to load skills:", err));
    runSearch("", { careerRoleId: "", skillId: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function chooseFilter(param, value) {
    const next = { ...selected, [param]: value };
    setSelected(next);
    setOpenFilter(null);
    runSearch(searchText, next);
  }

  function optionsFor(param) {
    return param === "careerRoleId" ? careerRoles : skills;
  }

  function selectedName(param) {
    const id = selected[param];
    return id ? optionsFor(param).find((o) => o.id === id)?.name : null;
  }

  const [bestMatch, ...otherCandidates] = candidates;

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

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Find Candidates
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search verified candidates by skills, role or keywords
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

        <main className="p-10">
          <form
            className="flex gap-3 mb-5"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(searchText, selected);
            }}
          >
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name, role or verified skill…"
              className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-sm"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3 mb-6" ref={filterRef}>
            {filters.map((f) => {
              const value = selectedName(f.param);
              const options = optionsFor(f.param);
              return (
                <div key={f.param} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFilter((o) => (o === f.param ? null : f.param))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      value
                        ? "bg-blue-50 border-primary text-primary"
                        : "bg-white border-slate-300 text-slate-700"
                    }`}
                  >
                    {value ? `${f.label}: ${value}` : f.label} ▾
                  </button>
                  {openFilter === f.param && (
                    <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <button
                        type="button"
                        onClick={() => chooseFilter(f.param, "")}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                          !selected[f.param]
                            ? "font-semibold text-primary"
                            : "text-slate-700"
                        }`}
                      >
                        Any
                      </button>
                      {options.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => chooseFilter(f.param, o.id)}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                            selected[f.param] === o.id
                              ? "font-semibold text-primary"
                              : "text-slate-700"
                          }`}
                        >
                          {o.name}
                        </button>
                      ))}
                      {options.length === 0 && (
                        <p className="px-4 py-2 text-sm text-slate-400">
                          No options available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <p className="py-10 text-center text-sm text-slate-500">
              Searching candidates…
            </p>
          )}

          {!loading && error && (
            <p className="py-10 text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && !bestMatch && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="font-semibold text-slate-900">
                No candidates found
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Try a different search or clear your filters.
              </p>
            </div>
          )}

          {!loading && !error && bestMatch && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-primary">
                    {initials(bestMatch.user.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {bestMatch.user.name}
                      </h2>
                      {bestMatch.verifiedSkills.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {bestMatch.targetCareerRole?.name ||
                        "No target role selected"}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <MatchRing match={bestMatch.match} />
                  <p className="text-xs text-slate-500 mt-1">Match</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Verified skills
                </h3>
                {bestMatch.verifiedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {bestMatch.verifiedSkills.map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2"
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {name}
                        </span>
                        <span className="text-green-700">✓</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No verified skills yet.
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Link
                  to={`/recruiter/candidates/${bestMatch.user.id}`}
                  className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark text-center"
                >
                  View full profile
                </Link>
                {otherCandidates.length > 0 && (
                  <button
                    onClick={() => setExploreOpen(true)}
                    className="flex-1 py-3.5 rounded-xl bg-blue-50 border border-blue-100 text-primary font-semibold text-sm"
                  >
                    Explore other candidates ({otherCandidates.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Explore other candidates modal */}
      {exploreOpen && (
        <Modal
          title="Other matching candidates"
          onClose={() => setExploreOpen(false)}
        >
          <p className="text-sm text-slate-500 mb-5">
            Based on your current search and filters, here are other candidates
            that match your requirements.
          </p>
          <div className="space-y-3">
            {otherCandidates.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-primary">
                    {initials(c.user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {c.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.targetCareerRole?.name || "No target role selected"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {c.verifiedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                      {c.verifiedSkills.length === 0 && (
                        <span className="text-[11px] text-slate-400">
                          No verified skills yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p
                      className={`font-bold ${c.match == null ? "text-slate-400" : "text-green-700"}`}
                    >
                      {formatMatch(c.match)}
                    </p>
                    <p className="text-[11px] text-slate-500">Match</p>
                  </div>
                  <Link
                    to={`/recruiter/candidates/${c.user.id}`}
                    onClick={() => setExploreOpen(false)}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark whitespace-nowrap"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
