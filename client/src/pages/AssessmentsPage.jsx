import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

const assessmentSubnav = [
  { label: 'Technical assessments', to: '/candidate/assessments' },
  { label: 'Assessment results', to: '/candidate/assessments/results' },
 
]

const tabs = ['All', 'Recommended', 'Completed', 'Not started']

// TODO (backend step): replace with the candidate's real assessments from the API.
const assessments = [
  {
    id: 'java-programming',
    name: 'Java programming',
    desc: 'Test core Java, OOP and collections.',
    status: 'Not started',
    tags: ['Intermediate', '30 mins', '20 questions'],
    icon: { bg: '#EFF6FF', fg: '#2563EB', glyph: '☕' },
    action: 'Start assessment',
  },
  {
    id: 'sql-database-fundamentals',
    name: 'SQL & database fundamentals',
    desc: 'Test queries, joins and database design.',
    status: 'Completed',
    tags: ['Intermediate', '25 mins', '15 questions'],
    icon: { bg: '#DCFCE7', fg: '#15803D', glyph: '🗄' },
    action: 'View results',
    result: { score: 86, correct: 13, total: 15, time: '21 mins' },
  },
  {
    id: 'rest-api-development',
    name: 'REST API development',
    desc: 'Test API design, HTTP methods and status codes.',
    status: 'Recommended',
    tags: ['Intermediate', '40 mins', '20 questions'],
    icon: { bg: '#DCFCE7', fg: '#15803D', glyph: '☁' },
    action: 'Start assessment',
  },
  {
    id: 'python-fundamentals',
    name: 'Python fundamentals',
    desc: 'Test syntax, data structures and basic scripting.',
    status: 'Not started',
    tags: ['Beginner', '25 mins', '18 questions'],
    icon: { bg: '#FEF3C7', fg: '#B45309', glyph: '🐍' },
    action: 'Start assessment',
  },
  {
    id: 'react-fundamentals',
    name: 'React fundamentals',
    desc: 'Test components, hooks and state management.',
    status: 'Recommended',
    tags: ['Intermediate', '35 mins', '20 questions'],
    icon: { bg: '#EFF6FF', fg: '#2563EB', glyph: '⚛' },
    action: 'Start assessment',
  },
  {
    id: 'git-version-control',
    name: 'Git & version control',
    desc: 'Test branching, merging and collaboration workflows.',
    status: 'Completed',
    tags: ['Beginner', '20 mins', '12 questions'],
    icon: { bg: '#DCFCE7', fg: '#15803D', glyph: '🔧' },
    action: 'View results',
    result: { score: 92, correct: 11, total: 12, time: '14 mins' },
  },
]

const statusStyles = {
  'Not started': 'bg-amber-50 text-amber-700',
  Completed: 'bg-[#E8F5EE] text-[#15803D]',
  Recommended: 'bg-blue-50 text-primary',
}

export default function AssessmentsPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('All')
  const [activeResult, setActiveResult] = useState(null)

  const visible = tab === 'All' ? assessments : assessments.filter((a) => a.status === tab)

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
          <Link
            to={navItems[0].to}
            className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {navItems[0].label}
          </Link>
          <Link
            to={navItems[1].to}
            className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {navItems[1].label}
          </Link>

          <div className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary">Assessments</div>
          <div className="ml-3 space-y-1 border-l border-gray-200 pl-3">
            {assessmentSubnav.map((item) => {
              const active = pathname === item.to
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm ${
                    active ? 'font-semibold text-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-primary' : 'bg-gray-300'}`} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {navItems.slice(2).map((item) => {
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
          <button className="min-h-11 w-full rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Log out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Technical Assessments</h1>
            <p className="text-sm text-gray-500">Complete assessments to verify your technical skills.</p>
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
          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
            {tabs.map((t) => {
              const active = tab === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium ${
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>

          {/* Assessment cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {visible.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl"
                    style={{ backgroundColor: a.icon.bg, color: a.icon.fg }}
                  >
                    {a.icon.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{a.name}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{a.desc}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() =>
                    a.action === 'View results'
                      ? setActiveResult(a)
                      : navigate(`/candidate/assessments/${a.id}/screen`)
                  }
                  className={`mt-5 min-h-12 w-full rounded-lg text-sm font-semibold ${
                    a.action === 'View results'
                      ? 'border border-primary text-primary hover:bg-blue-50'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {a.action}
                </button>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="col-span-2 py-10 text-center text-sm text-gray-500">
                No assessments in &ldquo;{tab}&rdquo; right now.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Results modal */}
      {activeResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setActiveResult(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{activeResult.name}</h2>
              <button
                onClick={() => setActiveResult(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20">
                <span className="text-2xl font-bold text-primary">{activeResult.result.score}%</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-gray-900">
                  {activeResult.result.correct}/{activeResult.result.total}
                </p>
                <p className="text-xs text-gray-500">Correct answers</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{activeResult.result.time}</p>
                <p className="text-xs text-gray-500">Time taken</p>
              </div>
            </div>

            <Link
              to="/candidate/assessments/results"
              className="mt-6 block min-h-11 w-full rounded-lg bg-primary text-center text-sm font-semibold leading-[44px] text-white hover:bg-primary-dark"
            >
              View full breakdown
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}