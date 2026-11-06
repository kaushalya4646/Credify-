import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Assessments", to: "/candidate/assessments" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "My Profile", to: "/candidate/profile" },
];

// TODO (backend step): replace every value below with the candidate's real skill-gap data from the API.
const overallMatch = 72;
const matchedCount = 16;
const missingCount = 4;
const totalSkills = 20;

const breakdown = [
  { label: "Proficiency", pct: 62, color: "#2563EB" },
  { label: "Database", pct: 50, color: "#16A34A" },
  { label: "Programming", pct: 15, color: "#DC2626" },
];

const verifiedSkills = [
  { name: "Java", bg: "#DCFCE7", fg: "#15803D", glyph: "☕" },
  { name: "Python", bg: "#DBEAFE", fg: "#2563EB", glyph: "🐍" },
  { name: "Spring Boot", bg: "#DCFCE7", fg: "#15803D", glyph: "⏻" },
  { name: "REST APIs", bg: "#DCFCE7", fg: "#15803D", glyph: "☁" },
];

const skillsToImprove = [
  {
    name: "Java fundamentals",
    label: "Proficiency",
    pct: 40,
    bg: "#DCFCE7",
    fg: "#15803D",
    glyph: "☕",
  },
  {
    name: "REST APIs",
    label: "Assessment status",
    pct: 60,
    bg: "#DCFCE7",
    fg: "#15803D",
    glyph: "☁",
  },
];

const missingSkills = [
  { name: "Cloud fundamentals (AWS/GCP)", pct: 35, glyph: "☁" },
  { name: "Distributed systems design", pct: 30, glyph: "🔗" },
  { name: "Kubernetes", pct: 18, glyph: "⚙" },
];

const recommendedActions = [
  { title: "Complete SQL assessment", sub: "Recommended", glyph: "→" },
  {
    title: "Learn database design principles",
    sub: "Course recommended",
    glyph: "📘",
  },
  {
    title: "Complete REST API assessment",
    sub: "Required for full verification",
    glyph: "→",
  },
];

const notifications = [
  {
    title: "New assessment recommended",
    detail: "React Performance assessment is ready for you",
  },
  { title: "Skill verified", detail: "Your Python skill has been verified" },
  {
    title: "Data Analysis needs verification",
    detail: "Take an assessment to verify this skill",
  },
];

function MatchRing({ pct }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-[128px] w-[128px]">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#2563EB"
          strokeWidth="10"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-500">
          {matchedCount} of {totalSkills} skills
        </span>
      </div>
    </div>
  );
}

export default function SkillGapsPage() {
  const { pathname } = useLocation();

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
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 px-2">
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path
              d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12.8 16.2l2.4 2.4 4-4.4"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold leading-none tracking-tight text-primary">
            Credify
          </span>
        </Link>

        <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Candidate workspace
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                  active ? "text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Your skill gap analysis
            </h1>
            <p className="text-sm text-gray-500">
              Analyze your technical skills against your target role to identify
              key learning opportunities.
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">
                  CS
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  Chethina Sri
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
                    to="/candidate/profile"
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

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {/* Summary */}
          <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Target role</p>
              <p className="text-xl font-bold text-gray-900">
                Backend developer
              </p>
            </div>
            <div className="sm:flex-1 sm:px-8">
              <p className="text-sm text-gray-500">Overall role match</p>
              <div className="mt-1 flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {overallMatch}%
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-primary"
                    style={{ width: `${overallMatch}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-primary">
                {matchedCount} matched · {missingCount} missing
              </span>
              <p className="mt-1 text-xs text-gray-500">
                Verify the {missingCount} missing skills to reach 100%
              </p>
            </div>
          </div>

          {/* Match breakdown + verified/improve */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">
                Match breakdown
              </h3>
              <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row">
                <MatchRing pct={overallMatch} />
                <div className="flex-1 space-y-5">
                  {breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">
                          {b.label}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: b.color }}
                        >
                          {b.pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${b.pct}%`,
                            backgroundColor: b.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Verified skills
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {verifiedSkills.map((s) => (
                    <div
                      key={s.name}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
                          style={{ backgroundColor: s.bg, color: s.fg }}
                        >
                          {s.glyph}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {s.name}
                        </span>
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2 py-0.5 text-xs font-semibold text-[#15803D]">
                        ✓ Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Skills to improve
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-5">
                  {skillsToImprove.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
                          style={{ backgroundColor: s.bg, color: s.fg }}
                        >
                          {s.glyph}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {s.name}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{s.label}</span>
                        <span className="font-semibold text-gray-900">
                          {s.pct}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-amber-400"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Missing skills + recommended actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">
                Missing skills
              </h3>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-gray-400">
                    <th className="pb-2 font-medium">Skill</th>
                    <th className="pb-2 font-medium">Progress</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {missingSkills.map((s) => (
                    <tr key={s.name} className="border-t border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-sm text-red-500">
                            {s.glyph}
                          </span>
                          <span className="font-medium text-gray-900">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="h-1.5 w-28 rounded-full bg-gray-200">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                          Not verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">
                Recommended actions
              </h3>
              <ul className="mt-4 divide-y divide-gray-100">
                {recommendedActions.map((a) => (
                  <li key={a.title}>
                    <a href="#" className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                        {a.glyph}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-gray-900">
                          {a.title}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {a.sub}
                        </span>
                      </span>
                      <span className="text-gray-300">›</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
