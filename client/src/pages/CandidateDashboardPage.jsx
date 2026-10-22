import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Assessments', to: '/candidate/assessments' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

// TODO (backend step): replace every array below with data from the API.
const statCards = [
  { label: 'Verified Skills', value: '14', sub: 'Skills backed by evidence' },
  { label: 'Completed Assessments', value: '8', sub: 'Your assessment progress' },
  { label: 'Skills Match', value: '85%', sub: 'Aligned with your career role', ring: 85 },
  { label: 'Skill Gaps', value: '5', sub: 'Opportunities to grow' },
]

const careerSkills = [
  { name: 'React', level: 'Level IV', bg: '#E8F1FF', tag: '⚛' },
  { name: 'JavaScript', level: 'Level IV', bg: '#FEF3C7', tag: 'JS' },
  { name: 'CSS/HTML', level: 'Level IV', bg: '#FFE4D6', tag: '5' },
  { name: 'Python', level: 'Level IV', bg: '#E0F2FE', tag: 'Py' },
]

const verificationSkills = [
  { name: 'React', pct: 85, ok: true },
  { name: 'Python', pct: 60, ok: true },
  { name: 'Data Analysis', pct: 30, ok: false },
]

const recommendedAssessments = [
  { name: 'React Performance', tag: '</>' },
  { name: 'Data Science Fundamentals', tag: '📊' },
  { name: 'System Design', tag: '🔗' },
]

const recentResults = [
  { name: 'Python: Data Structures', date: '2024-05-15', score: '92%' },
  { name: 'Data Science Fundamentals', date: '2024-05-15', score: '93%' },
  { name: 'Python: Data Analysis', date: '2024-05-16', score: '92%' },
]

const recommendedActions = [
  { title: 'Complete verified skill profile', link: 'Go to My Profile →', to: '/candidate/profile' },
  { title: 'Take recommended React assessment', link: 'Start assessment →', to: '#' },
  { title: 'Share profile with recruiters', link: 'Share profile →', to: '#' },
]

export default function CandidateDashboardPage() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2 px-2">
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12.8 16.2l2.4 2.4 4-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold leading-none tracking-tight text-primary">Credify</span>
        </Link>

        <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Candidate workspace
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                  active ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <p className="text-sm font-semibold text-gray-900">Here to help you grow</p>
          <p className="mt-1 text-xs leading-5 text-gray-600">
            Get help with your profile, skills and assessments.
          </p>
          <a href="#" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
            Visit help center ↗
          </a>
        </div>

        <div className="mt-auto space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">
              CS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">Chethina Sri</p>
              <p className="text-xs text-gray-500">Candidate account</p>
            </div>
          </div>
          <Link
            to="/"
           className="min-h-11 w-full rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Log out
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Your skills, progress and next steps</p>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Help" className="text-gray-400 hover:text-gray-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.6" fill="currentColor" />
              </svg>
            </button>
            <button aria-label="Notifications" className="relative text-gray-400 hover:text-gray-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
              </svg>
              <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">
                CS
              </div>
              <span className="hidden text-sm font-medium text-gray-700 sm:block">Chethina Sri</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {/* Greeting */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Good morning, Chethina Sri</h2>
              <p className="mt-1 text-sm text-gray-500">
                Track your progress and build your verified career profile.
              </p>
            </div>
            <Link
              to="/candidate/profile"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View My Profile
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  {s.ring !== undefined ? (
                    <div className="relative h-6 w-6">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <circle
                          cx="12" cy="12" r="10" fill="none" stroke="#2563EB" strokeWidth="3"
                          strokeDasharray={`${(s.ring / 100) * 62.8} 62.8`} strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <span className="text-gray-300">●</span>
                  )}
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Career role + verification */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Current Career Role</h3>
                <a href="#" className="text-sm font-semibold text-primary hover:underline">Change Role</a>
              </div>

              <div className="mt-4 flex items-center gap-3 border-b border-gray-200 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-primary">
                  💼
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Current role</p>
                  <p className="font-semibold text-gray-900">Senior Frontend Engineer</p>
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                {careerSkills.map((s) => (
                  <li key={s.name} className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                      style={{ backgroundColor: s.bg }}
                    >
                      {s.tag}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900">{s.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                      ✓ {s.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Skill Verification Process</h3>
              <p className="mt-1 text-sm text-gray-500">Keep building evidence for your career skills.</p>

              <div className="mt-5 space-y-5">
                {verificationSkills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <div className="flex items-center gap-3">
                        {s.ok ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-[#15803D]">✓</span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            ⚠ Need verification
                          </span>
                        )}
                        <span className="font-semibold text-gray-900">{s.pct}%</span>
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                      <div
                        className={`h-1.5 rounded-full ${s.ok ? 'bg-primary' : 'bg-amber-400'}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                ⚠ Data Analysis needs verification. Take an assessment to continue.
              </div>
            </div>
          </div>

          {/* Recommended assessments */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Recommended Assessments</h3>
              <Link to="/candidate/assessments" className="text-sm font-semibold text-primary hover:underline">
                View all assessments →
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {recommendedAssessments.map((a) => (
                <div key={a.name} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-base">
                    {a.tag}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">{a.name}</p>
                  <a href="#" className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                    Start assessment →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Results + actions */}
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Results</h3>
                <Link to="/candidate/assessments" className="text-sm font-semibold text-primary hover:underline">
                  View all results →
                </Link>
              </div>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Score</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((r) => (
                    <tr key={r.name} className="border-t border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="py-3 text-gray-500">{r.date}</td>
                      <td className="py-3 font-semibold text-gray-900">{r.score}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                          ✓ Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Recommended Actions</h3>
              <ul className="mt-4 space-y-4">
                {recommendedActions.map((a) => (
                  <li key={a.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                      →
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.title}</p>
                      <Link to={a.to} className="text-sm font-semibold text-primary hover:underline">
                        {a.link}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <footer className="flex flex-col gap-2 border-t border-gray-200 px-6 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© Credify · Your skills. Your credibility.</p>
          <p className="space-x-4">
            <a href="#" className="hover:underline">Privacy policy</a>
            <a href="#" className="hover:underline">Terms of service</a>
          </p>
        </footer>
      </div>
    </div>
  )
}