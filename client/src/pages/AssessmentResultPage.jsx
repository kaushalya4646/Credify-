import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

const assessmentSubnav = [
  { label: 'Technical assessments', to: '/candidate/assessments' },
  { label: 'Assessment results', to: '/candidate/assessments/results' },
  { label: 'Assessment screen', to: '/candidate/assessments/screen' },
]

// TODO (backend step): replace every value below with this attempt's real result from the API.
const assessmentName = 'Java programming'
const overallScore = 82
const correct = 16
const incorrect = 4
const total = 20

const strengths = [
  { title: 'Java fundamentals', desc: 'Excellent understanding of core language concepts', glyph: '☕' },
  { title: 'Object-oriented programming', desc: 'Strong grasp of classes, inheritance and interfaces', glyph: '▣' },
  { title: 'Java syntax', desc: 'Writes clean, correct code with few errors', glyph: '{ }' },
]

const skillBreakdown = [
  { name: 'Object-oriented programming', pct: 91 },
  { name: 'Algorithms', pct: 27 },
  { name: 'Data structures', pct: 48 },
  { name: 'Java syntax', pct: 92 },
]

const areasForImprovement = [
  { title: 'Advanced concurrency', desc: 'Improve thread synchronization, executors and deadlock avoidance.', glyph: '⑂' },
  { title: 'Java collections', desc: 'Deepen your understanding of HashMap, TreeMap and concurrent collections.', glyph: '🗄' },
]

function barColor(pct) {
  if (pct >= 70) return '#16A34A'
  if (pct >= 40) return '#D97706'
  return '#DC2626'
}

function ScoreRing({ pct }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto h-[112px] w-[112px]">
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#FCA5A5" strokeWidth="10" />
        <circle
          cx="56" cy="56" r={r} fill="none" stroke="#16A34A" strokeWidth="10"
          strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{pct}%</span>
        <span className="text-[11px] text-gray-500">{correct} of {total} correct</span>
      </div>
    </div>
  )
}

export default function AssessmentResultPage() {
  const { pathname } = useLocation()
  const [showAllStrengths, setShowAllStrengths] = useState(false)
  const visibleStrengths = showAllStrengths ? strengths : strengths.slice(0, 3)

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
            <h1 className="text-xl font-semibold text-gray-900">Assessment result</h1>
            <p className="text-sm text-gray-500">{assessmentName}</p>
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
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-2xl text-primary">
                    ☕
                  </span>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{overallScore}%</p>
                    <p className="text-sm text-gray-500">Overall score</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#E8F5EE] px-3 py-1 text-sm font-semibold text-[#15803D]">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-green-500" />
                    <span className="text-gray-600">Correct</span>
                    <span className="ml-6 font-semibold text-gray-900">{correct}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-red-500" />
                    <span className="text-gray-600">Incorrect</span>
                    <span className="ml-6 font-semibold text-gray-900">{incorrect}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-gray-200" />
                    <span className="text-gray-600">Total</span>
                    <span className="ml-6 font-semibold text-gray-900">{total}</span>
                  </div>
                </div>
                <ScoreRing pct={overallScore} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Strengths</h3>
              <ul className="mt-4 space-y-4">
                {visibleStrengths.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-base text-[#15803D]">
                      {s.glyph}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {strengths.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllStrengths(!showAllStrengths)}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  <span>{showAllStrengths ? '⌃' : '⌄'}</span>
                  {showAllStrengths ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Skill breakdown</h3>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
                {skillBreakdown.map((s) => (
                  <div key={s.name} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base text-primary">
                      ▣
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{s.name}</span>
                        <span className="font-semibold" style={{ color: barColor(s.pct) }}>{s.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${s.pct}%`, backgroundColor: barColor(s.pct) }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Areas for improvement</h3>
              <ul className="mt-4 space-y-4">
                {areasForImprovement.map((a) => (
                  <li key={a.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-base text-red-500">
                      {a.glyph}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/candidate/profile"
              className="flex min-h-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View skill profile
            </Link>
            <Link
              to="/candidate/assessments"
              className="flex min-h-12 items-center justify-center gap-1 rounded-lg border border-primary text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Explore recommended assessments ↗
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}