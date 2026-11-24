import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LogoutLink from "../components/LogoutLink";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Assessments', to: '/candidate/assessments' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

const recommendedActions = [
  { title: 'Complete verified skill profile', link: 'Go to My Profile ›', to: '/candidate/profile' },
  { title: 'Take recommended React assessment', link: 'Start assessment ›', to: '/candidate/assessments' },
  { title: 'Share profile with recruiters', link: 'Share profile ›', to: '#' },
]

const notifications = [
  { title: 'New assessment recommended', detail: 'React Performance assessment is ready for you' },
  { title: 'Skill verified', detail: 'Your Python skill has been verified' },
  { title: 'Data Analysis needs verification', detail: 'Take an assessment to verify this skill' },
]

export default function CandidateDashboardPage() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const [openMenu, setOpenMenu] = useState(null)
  const menuRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [verifications, setVerifications] = useState([])
  const [attempts, setAttempts] = useState([])
  const [assessments, setAssessments] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [verificationsData, attemptsData, assessmentsData, selectedRoleData] = await Promise.all([
          api.get('/api/skill-verifications/me'),
          api.get('/api/assessments/attempts/me'),
          api.get('/api/assessments'),
          api.get('/api/career-roles/me/selected'),
        ])
        setVerifications(verificationsData || [])
        setAttempts(attemptsData || [])
        setAssessments(assessmentsData || [])
        setSelectedRole(selectedRoleData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name))
  }

  const verifiedCount = verifications.filter((v) => v.status === 'Verified').length
  // Distinct assessments, so retakes don't inflate the count.
  const completedCount = new Set(
    attempts.filter((a) => a.status === 'Completed').map((a) => a.assessmentId)
  ).size

  // Match % and gap count against the selected role's required skills, if any.
  let matchPct = null
  let gapCount = null
  if (selectedRole) {
    const required = selectedRole.requiredSkills || []
    const matched = required.filter((s) => verifications.some((v) => v.skillId === s.skillId && v.status === 'Verified'))
    matchPct = required.length ? Math.round((matched.length / required.length) * 100) : 0
    gapCount = required.length - matched.length
  }

  const statCards = [
    { label: 'Verified Skills', value: String(verifiedCount), sub: 'Skills backed by evidence', icon: 'shield-checkmark-outline' },
    { label: 'Completed Assessments', value: String(completedCount), sub: 'Your assessment progress', icon: 'document-text-outline' },
    {
      label: 'Skills Match',
      value: selectedRole ? `${matchPct}%` : '—',
      sub: selectedRole ? `vs. ${selectedRole.name}` : 'Select a career role to see this',
      icon: 'speedometer-outline',
    },
    {
      label: 'Skill Gaps',
      value: selectedRole ? String(gapCount) : '—',
      sub: selectedRole ? 'Skills left to verify' : 'Select a career role to see this',
      icon: 'trending-up-outline',
    },
  ]

  const verificationSkills = verifications.map((v) => {
    const skillAttempts = attempts.filter(
      (a) => a.assessment?.skillId === v.skillId && a.status === 'Completed'
    )
    const bestScore = skillAttempts.length > 0 ? Math.max(...skillAttempts.map((a) => a.score || 0)) : 0
    return {
      name: v.skill?.name || v.skillId,
      pct: bestScore,
      ok: v.status === 'Verified',
    }
  })

  const attemptedAssessmentIds = new Set(
    attempts.filter((a) => a.status === 'Completed').map((a) => a.assessmentId)
  )
  const recommendedAssessments = assessments
    .filter((a) => !attemptedAssessmentIds.has(a.id))
    .slice(0, 3)
    .map((a) => ({ name: a.title, tag: '</>' }))

  const recentResults = attempts
    .filter((a) => a.status === 'Completed')
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((a) => ({
      name: a.assessment?.title || 'Assessment',
      date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '',
      score: `${a.score}%`,
    }))

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
        <p className="text-sm text-gray-500">Loading your dashboard…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
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
                  active ? 'text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Your skills, progress and next steps</p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            {/* Help dropdown */}
            <div className="relative">
              <button
                aria-label="Help"
                onClick={() => toggleMenu('help')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                </svg>
              </button>
              {openMenu === 'help' && (
                <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/help-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Visit help center</Link>
                  <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy policy</Link>
                  <Link to="/terms-of-service" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of service</Link>
                  <Link to="/about-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About us</Link>
                  <Link to="/feedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Give feedback about Credify</Link>
                </div>
              )}
            </div>

            {/* Notifications dropdown */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => toggleMenu('notifications')}
                className="relative text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
                </svg>
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              {openMenu === 'notifications' && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-900">Notifications</p>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <a key={n.title} href="#" className="block border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50">
                        <span className="block font-medium text-gray-900">{n.title}</span>
                        <span className="block text-xs text-gray-500">{n.detail}</span>
                      </a>
                    ))}
                  </div>
                  <Link to="#" className="block border-t border-gray-100 px-4 py-2 text-center text-sm font-semibold text-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => toggleMenu('profile')} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">{user?.name || 'Candidate'}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openMenu === 'profile' && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/candidate/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <div className="my-1 border-t border-gray-100" />
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {/* Greeting */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Good morning, {user?.name || 'there'}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Track your progress and build your verified career profile.
              </p>
            </div>
            <Link
              to="/candidate/profile"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
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
                  <ion-icon name={s.icon} class="text-gray-300" className="h-6 w-6"></ion-icon>
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
                <Link to="/candidate/career-role" className="text-sm font-semibold text-primary hover:underline">Change Role ›</Link>
              </div>

              {selectedRole ? (
                <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    💼
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedRole.name}</p>
                  <p className="text-sm text-gray-500">
                    {matchPct}% match · {gapCount} skill{gapCount === 1 ? '' : 's'} left to verify
                  </p>
                  <Link
                    to="/candidate/skill-gaps"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    View Skill Gaps
                  </Link>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    💼
                  </div>
                  <p className="text-sm text-gray-500">You haven't selected a career role yet.</p>
                  <Link
                    to="/candidate/career-role"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    Choose a Career Role
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Skill Verification Process</h3>
              <p className="mt-1 text-sm text-gray-500">Keep building evidence for your career skills.</p>

              {verificationSkills.length === 0 ? (
                <p className="mt-5 text-sm text-gray-400">No skills tracked yet. Take an assessment to get started.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {verificationSkills.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{s.name}</span>
                        <div className="flex items-center gap-3">
                          {s.ok ? (
                            <span className="rounded-full bg-[#E8F5EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                              Verified
                            </span>
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
              )}
            </div>
          </div>

          {/* Recommended assessments */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Recommended Assessments</h3>
              <Link to="/candidate/assessments" className="text-sm font-semibold text-primary hover:underline">
                View all assessments ›
              </Link>
            </div>
            {recommendedAssessments.length === 0 ? (
              <p className="mt-4 text-sm text-gray-400">You're all caught up — no new assessments right now.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {recommendedAssessments.map((a) => (
                  <div key={a.name} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-base">
                      {a.tag}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-900">{a.name}</p>
                    <Link to="/candidate/assessments" className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                      Start assessment ›
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results + actions */}
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Results</h3>
                <Link to="/candidate/assessments" className="text-sm font-semibold text-primary hover:underline">
                  View all results ›
                </Link>
              </div>
              {recentResults.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">No completed assessments yet.</p>
              ) : (
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
                    {recentResults.map((r, i) => (
                      <tr key={`${r.name}-${i}`} className="border-t border-gray-100">
                        <td className="py-3 font-medium text-gray-900">{r.name}</td>
                        <td className="py-3 text-gray-500">{r.date}</td>
                        <td className="py-3 font-semibold text-gray-900">{r.score}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                            ✓ Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Recommended Actions</h3>
              <ul className="mt-4 space-y-4">
                {recommendedActions.map((a) => (
                  <li key={a.title} className="flex gap-3 border-b border-gray-200 pb-2">
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
      </div>
    </div>
  )
}