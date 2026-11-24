// CandidateProfileRecruiterViewPage.jsx
import { Link, useLocation, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import LogoutLink from "../components/LogoutLink";
import { api } from '../api/client'

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'Find Candidates', path: '/recruiter/find-candidates' },
  { label: 'Create Jobs', path: '/recruiter/jobs/create' },
  { label: 'Saved Candidates', path: '/recruiter/saved-candidates' },
  { label: 'My Profile', path: '/recruiter/profile' },
]

const notifications = [
  { title: 'New application received', detail: 'A candidate applied to Backend Engineer' },
  { title: 'Candidate match found', detail: 'Danee Smith matches 92% for Senior Frontend Engineer' },
  { title: 'Job posting expiring soon', detail: 'Frontend Engineer posting closes in 3 days' },
]

function RecruiterSidebar() {
  const location = useLocation()
  return (
    <aside className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto w-60 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-primary">Credify</span>
      </div>
      <p className="px-6 text-[11px] tracking-wide text-slate-500">RECRUITER WORKSPACE</p>
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                active ? 'text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

// pct may be null (e.g. no target role) — then show a muted, empty ring with "—".
function ScoreRing({ pct, color = '#16a34a', size = 56 }) {
  const r = (size - 10) / 2
  const circumference = 2 * Math.PI * r
  const hasValue = pct != null
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e9f0" strokeWidth="7" />
        {/* Skip the arc at 0% — a round line cap would still draw a dot. */}
        {hasValue && pct > 0 && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${circumference * (pct / 100)} ${circumference}`}
          />
        )}
      </svg>
      <span
        className={`absolute font-bold ${size < 64 ? 'text-[11px]' : 'text-sm'} ${hasValue ? 'text-slate-900' : 'text-slate-400'}`}
      >
        {hasValue ? `${pct}%` : '—'}
      </span>
    </div>
  )
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : ''
}

// Project links are free text; make sure they open as absolute URLs.
function toHref(link) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`
}

export default function CandidateProfileRecruiterViewPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        setProfile(await api.get(`/api/recruiter/candidates/${id}`))
      } catch (err) {
        console.error('Failed to load candidate profile:', err)
        setError(err.message || 'Could not load this candidate.')
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const [openMenu, setOpenMenu] = useState(null) // 'help' | 'notifications' | 'profile' | null
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Candidate Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Recruiter view of a verified candidate profile</p>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                  MP
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">M Perera</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openMenu === 'profile' && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/recruiter/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <div className="my-1 border-t border-gray-100" />
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          {loading && <p className="py-10 text-center text-sm text-slate-500">Loading candidate…</p>}

          {!loading && error && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="font-semibold text-slate-900">{error}</p>
              <Link to="/recruiter/find-candidates" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                Back to Find Candidates
              </Link>
            </div>
          )}

          {!loading && !error && profile && (() => {
            const verifiedSkills = profile.user.skillVerifications.filter((v) => v.status === 'Verified')
            const results = profile.assessmentResults || []
            const technicalSkills = (profile.technicalSkills || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            const careerInterests = profile.careerInterests?.trim()
            const education = profile.education?.trim()
            const projects = profile.projects || []
            const certifications = profile.certifications || []

            return (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-3xl font-semibold text-primary">
                      {initials(profile.user.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-semibold text-slate-900">{profile.user.name}</h2>
                        {verifiedSkills.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ Verified Profile</span>
                        )}
                      </div>
                      <p className="text-slate-500 mb-3">{profile.targetCareerRole?.name || 'No target role selected'}</p>
                      <div className="flex gap-3">
                        <button className="px-5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-primary text-sm font-semibold">Save candidate</button>
                        <button className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Contact candidate</button>
                      </div>
                    </div>
                  </div>
                  {/* No "match" field at all = candidate matching is turned off. */}
                  {"match" in profile && (
                  <div className="text-center">
                    <ScoreRing pct={profile.match} size={88} />
                    <p className="text-xs text-slate-500 mt-2">Match score</p>
                    {profile.match == null && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {profile.targetCareerRole ? 'Role has no required skills' : 'No target role selected'}
                      </p>
                    )}
                  </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                      <h3 className="font-medium text-slate-900">Professional summary</h3>
                      {profile.bio?.trim() ? (
                        <p className="text-sm text-slate-700 whitespace-pre-line">{profile.bio}</p>
                      ) : (
                        <p className="text-sm text-slate-400">No summary provided.</p>
                      )}

                      {careerInterests && (
                        <div className="border-t border-slate-100 pt-5">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Career interests</h4>
                          <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">
                            {careerInterests}
                          </span>
                        </div>
                      )}

                      {technicalSkills.length > 0 && (
                        <div className="border-t border-slate-100 pt-5">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">Technical skills</h4>
                          <p className="text-xs text-slate-500 mb-2">Self-reported, not verified by Credify.</p>
                          <div className="flex gap-2 flex-wrap">
                            {technicalSkills.map((s) => (
                              <span key={s} className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {education && (
                        <div className="border-t border-slate-100 pt-5">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Education</h4>
                          <p className="text-sm font-medium text-slate-900">{education}</p>
                        </div>
                      )}
                    </div>

                    {projects.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-medium text-slate-900 mb-4">Projects</h3>
                        <div className="space-y-4">
                          {projects.map((proj) => (
                            <div key={proj.id} className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700">🔗</div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 text-sm">{proj.name}</p>
                                {proj.link && (
                                  <a
                                    href={toHref(proj.link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block truncate text-xs text-primary font-medium hover:underline"
                                  >
                                    {proj.link}
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {certifications.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-medium text-slate-900 mb-4">Certifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {certifications.map((cert) => (
                            <div key={cert.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">🎓</div>
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{cert.name}</p>
                                <p className="text-xs text-slate-500">Certification</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h3 className="font-medium text-slate-900 mb-1">Verified skills</h3>
                      <p className="text-xs text-slate-500 mb-4">Confirmed through Credify assessments.</p>
                      {verifiedSkills.length > 0 ? (
                        <div className="space-y-4">
                          {verifiedSkills.map((v) => (
                            <div key={v.id} className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{v.skill.name}</p>
                                <p className="text-xs text-slate-500">
                                  {[v.skill.category, v.verifiedAt && `Verified ${formatDate(v.verifiedAt)}`]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </p>
                              </div>
                              <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ Verified</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No verified skills yet.</p>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h3 className="font-medium text-slate-900 mb-4">Assessment results</h3>
                      {results.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {results.map((result, i) => (
                            <div key={`${result.skillName}-${result.completedAt}-${i}`} className="border border-slate-200 rounded-xl p-4 text-center">
                              <p className="text-sm font-semibold text-slate-900 mb-1">{result.skillName}</p>
                              <p className="text-xs text-slate-500 mb-3">{formatDate(result.completedAt)}</p>
                              <ScoreRing pct={result.score} size={52} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No completed assessments yet.</p>
                      )}
                    </div>

                    {(verifiedSkills.length > 0 || results.length > 0) && (
                      <div className="bg-green-50 rounded-2xl p-6">
                        <h3 className="font-semibold text-green-800 mb-2">✓ Verified profile</h3>
                        <p className="text-sm text-green-800">
                          {verifiedSkills.length} verified skill{verifiedSkills.length === 1 ? '' : 's'} and{' '}
                          {results.length} completed assessment{results.length === 1 ? '' : 's'}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </main>
      </div>
    </div>
  )
}
