import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

const filters = [
  "Career role",
  "Technical skills",
  "Verified skills",
  "Experience",
  "Assessment score",
  "Education",
];

const verifiedSkills = [
  { name: "Java", pct: 40 },
  { name: "Spring Boot", pct: 90 },
  { name: "SQL", pct: 70 },
  { name: "REST APIs", pct: 75 },
];

const candidateId = "1"; // TODO: replace with the real candidate's id once this page uses live data

// TODO (backend step): replace with real candidates matching the recruiter's filters/search.
const otherCandidates = [
  {
    id: "2",
    name: "Raveen Caldera",
    role: "DevOps Engineer",
    match: 88,
    skills: ["Docker", "CI/CD", "AWS"],
    experience: "3 years",
  },
  {
    id: "3",
    name: "Amara Perera",
    role: "Frontend Engineer",
    match: 91,
    skills: ["React", "CSS", "TypeScript"],
    experience: "2 years",
  },
  {
    id: "4",
    name: "Nadun Fernando",
    role: "Backend Developer",
    match: 85,
    skills: ["Java", "Spring Boot", "SQL"],
    experience: "4 years",
  },
  {
    id: "5",
    name: "Ishara Wickrama",
    role: "Full Stack Developer",
    match: 79,
    skills: ["Node.js", "React", "MongoDB"],
    experience: "2 years",
  },
];

export default function FindCandidatesPage() {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Career role");
  const [exploreOpen, setExploreOpen] = useState(false);

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
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Visit help center
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Privacy policy
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Terms of service
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    About us
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Give feedback about Credify
                  </a>
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
                    to="#"
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

        <main className="p-10">
          <div className="flex gap-3 mb-5">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by skills, role or keywords…"
              className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-sm"
            />
            <button className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  activeFilter === f
                    ? "bg-blue-50 border-primary text-primary"
                    : "bg-white border-slate-300 text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-primary">
                  CS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Chethina Sri
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Backend Developer</p>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#e5e9f0"
                      strokeWidth="9"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38 * 0.92} ${2 * Math.PI * 38}`}
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-slate-900">
                    92%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Match</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Verified skills
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {verifiedSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700 font-bold text-xs">
                      {skill.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-semibold text-slate-900 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-green-700">✓</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-green-600"
                          style={{ width: `${skill.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="8" width="18" height="12" rx="2.5" />
                    <path d="M9 8V5.5h6V8" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">2 years</p>
                  <p className="text-xs text-slate-500">Experience</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                to={`/recruiter/candidates/${candidateId}`}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark text-center"
              >
                View full profile
              </Link>
              <button
                onClick={() => setExploreOpen(true)}
                className="flex-1 py-3.5 rounded-xl bg-blue-50 border border-blue-100 text-primary font-semibold text-sm"
              >
                Explore other candidates
              </button>
            </div>
          </div>
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
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.role} · {c.experience}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="font-bold text-green-700">{c.match}%</p>
                    <p className="text-[11px] text-slate-500">Match</p>
                  </div>
                  <Link
                    to={`/recruiter/candidates/${c.id}`}
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
