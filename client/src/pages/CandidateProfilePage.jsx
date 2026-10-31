import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Assessments', to: '/candidate/assessments' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

// TODO (backend step): replace every array/value below with the candidate's real data from the API.
const verifiedSkills = [
  { name: 'Java', pct: 40 },
  { name: 'Spring Boot', pct: 90 },
  { name: 'SQL', pct: 40 },
  { name: 'REST APIs', pct: 40 },
]

const assessmentResults = [
  { name: 'Recent Java Assessment', date: '04/09/2023', pct: 95 },
  { name: 'Recent SQL Assessment', date: '04/01/2023', pct: 75 },
]

const preferenceOptions = [
  { title: 'Career opportunities', desc: 'Updates about roles relevant to your career interests.' },
  { title: 'Assessment reminders', desc: 'Reminders to continue your skills journey.' },
  { title: 'Product news and learning tips', desc: 'Helpful resources and the latest from Credify.' },
]

function ScoreRing({ pct }) {
  const r = 28
  const c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto h-[72px] w-[72px]">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke="#2563EB" strokeWidth="6"
          strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{pct}%</span>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default function CandidateProfilePage() {
  const { pathname } = useLocation()

  // which modal is open
  const [openModal, setOpenModal] = useState(null) // 'editProfile' | 'aboutMe' | 'projects' | 'certifications' | 'verification' | 'accountSettings' | null

  // editable state
  const [profile, setProfile] = useState({
    name: 'Chethina Sri',
    title: 'Backend Developer',
    education: 'The Open University of Sri Lanka',
  })

  const [about, setAbout] = useState({
    bio: 'Chethina Sri is a professional developer on commercial automation and back end developing.',
    careerInterests: 'Software Architecture and Cloud Computing',
    education: 'The Open University of Sri Lanka',
  })

  const [projects, setProjects] = useState([
    { name: 'Inventory Management API', link: 'GitHub.com/gitHub' },
    { name: 'File Sharing System', link: 'GitHub.com/gitHub' },
  ])
  const [newProject, setNewProject] = useState({ name: '', link: '' })

  const [certifications, setCertifications] = useState([
    { name: 'Google Java Programming', sub: 'Certifications' },
    { name: 'Java site', sub: 'Certifications' },
  ])
  const [newCertification, setNewCertification] = useState({ name: '', sub: '' })

  const [account, setAccount] = useState({ email: '', phone: '' })

  function handleAddProject(e) {
    e.preventDefault()
    if (!newProject.name.trim()) return
    setProjects((prev) => [...prev, newProject])
    setNewProject({ name: '', link: '' })
  }

  function handleRemoveProject(name) {
    setProjects((prev) => prev.filter((p) => p.name !== name))
  }

  function handleAddCertification(e) {
    e.preventDefault()
    if (!newCertification.name.trim()) return
    setCertifications((prev) => [...prev, { ...newCertification, sub: newCertification.sub || 'Certifications' }])
    setNewCertification({ name: '', sub: '' })
  }

  function handleRemoveCertification(name) {
    setCertifications((prev) => prev.filter((c) => c.name !== name))
  }

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
              <p className="truncate text-sm font-semibold text-gray-900">{profile.name}</p>
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
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your professional identity and account</p>
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
              <span className="hidden text-sm font-medium text-gray-700 sm:block">{profile.name}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {/* Profile header card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-semibold text-primary">
                  CS
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-0.5 text-xs font-semibold text-[#15803D]">
                      ✓ Verified Profile
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{profile.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    🎓 {profile.education}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenModal('editProfile')}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>4 verified skills · 2 assessment results · {projects.length} projects</p>
              <p className="text-gray-400">Your candidate profile</p>
            </div>
          </div>

          {/* About + skills */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">About Me</h3>
                <button onClick={() => setOpenModal('aboutMe')} className="text-sm font-semibold text-primary hover:underline">
                  Edit
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{about.bio}</p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Career interests
              </p>
              <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                {about.careerInterests}
              </span>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Education
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                🎓 {about.education}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Verified Skills</h3>
              <p className="mt-1 text-sm text-gray-500">Your verified skills and proficiency levels.</p>
              <div className="mt-5 space-y-4">
                {verifiedSkills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        {s.name}
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2 py-0.5 text-[11px] font-semibold text-[#15803D]">
                          ✓ Verified
                        </span>
                      </span>
                      <span className="font-semibold text-gray-900">{s.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Projects</h3>
              <button onClick={() => setOpenModal('projects')} className="text-sm font-semibold text-primary hover:underline">
                Manage
              </button>
            </div>
            <ul className="mt-4 divide-y divide-gray-100">
              {projects.map((p) => (
                <li key={p.name} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    📁
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <a href="#" className="text-xs text-gray-500 hover:underline">{p.link} ↗</a>
                  </div>
                </li>
              ))}
              {projects.length === 0 && <p className="py-3 text-sm text-gray-500">No projects added yet.</p>}
            </ul>
          </div>

          {/* Assessment results + certifications */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Assessment Results</h3>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {assessmentResults.map((a) => (
                  <div key={a.name} className="rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.date}</p>
                    <div className="mt-3">
                      <ScoreRing pct={a.pct} />
                      <p className="mt-1 text-xs text-gray-500">Score</p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-0.5 text-xs font-semibold text-[#15803D]">
                      ✓ Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Certifications</h3>
                <button onClick={() => setOpenModal('certifications')} className="text-sm font-semibold text-primary hover:underline">
                  Manage
                </button>
              </div>
              <ul className="mt-4 divide-y divide-gray-100">
                {certifications.map((c) => (
                  <li key={c.name} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                      🏅
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.sub}</p>
                    </div>
                  </li>
                ))}
                {certifications.length === 0 && <p className="py-3 text-sm text-gray-500">No certifications added yet.</p>}
              </ul>
            </div>
          </div>

          {/* Verified banner */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#15803D]">
              ✓ Verified Profile
            </p>
            <p className="mt-1 text-sm text-green-800">
              Your profile, 4 skills and both assessment results are marked verified.
            </p>
            <button
              onClick={() => setOpenModal('verification')}
              className="mt-2 inline-block text-sm font-semibold text-[#15803D] hover:underline"
            >
              View verification details →
            </button>
          </div>

          {/* Preferences + account settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">Make Credify work for you</h3>
            <p className="mt-1 text-sm text-gray-500">
              Control your communication preferences and keep your account up to date.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="font-semibold text-gray-900">Communication preferences</h4>
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                ⓘ Not configured · Select what you&rsquo;d like to receive
              </p>

              <div className="mt-4 space-y-4">
                {preferenceOptions.map((p) => (
                  <label key={p.title} className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" className="mt-1 h-[18px] w-[18px] rounded-[5px] border-gray-300 accent-primary" />
                    <span>
                      <span className="block text-sm font-medium text-gray-900">{p.title}</span>
                      <span className="block text-xs text-gray-500">{p.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <a href="#" className="text-sm font-semibold text-primary hover:underline">Email preferences</a>
                <button className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark">
                  Save preferences
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Account settings</h4>
                <button onClick={() => setOpenModal('accountSettings')} className="text-sm font-semibold text-primary hover:underline">
                  Manage
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs text-gray-500">Email address</p>
                  <p className="text-sm font-semibold text-gray-900">{account.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone number</p>
                  <p className="text-sm font-semibold text-gray-900">{account.phone || 'Not provided'}</p>
                </div>
              </div>

              <a href="#" className="flex items-center gap-3 border-b border-gray-100 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">🔒</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">Password &amp; security</span>
                  <span className="block text-xs text-gray-500">Manage how you access your account</span>
                </span>
                <span className="text-gray-300">›</span>
              </a>
              <a href="#" className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">🛡</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">Privacy &amp; profile visibility</span>
                  <span className="block text-xs text-gray-500">Choose how your profile is shared</span>
                </span>
                <span className="text-gray-300">›</span>
              </a>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <a href="#" className="font-semibold text-primary hover:underline">Download my data</a>
                <a href="#" className="font-semibold text-gray-400 hover:underline">Close account</a>
              </div>
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

      {/* Edit Profile modal */}
      {openModal === 'editProfile' && (
        <Modal title="Edit profile" onClose={() => setOpenModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setOpenModal(null)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title / Role</label>
              <input
                value={profile.title}
                onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Education</label>
              <input
                value={profile.education}
                onChange={(e) => setProfile((p) => ({ ...p, education: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <button type="submit" className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {/* About Me modal */}
      {openModal === 'aboutMe' && (
        <Modal title="Edit About Me" onClose={() => setOpenModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setOpenModal(null)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={about.bio}
                onChange={(e) => setAbout((a) => ({ ...a, bio: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Career interests</label>
              <input
                value={about.careerInterests}
                onChange={(e) => setAbout((a) => ({ ...a, careerInterests: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Education</label>
              <input
                value={about.education}
                onChange={(e) => setAbout((a) => ({ ...a, education: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <button type="submit" className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {/* Projects modal */}
      {openModal === 'projects' && (
        <Modal title="Manage projects" onClose={() => setOpenModal(null)}>
          <ul className="divide-y divide-gray-100 mb-5">
            {projects.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.link}</p>
                </div>
                <button
                  onClick={() => handleRemoveProject(p.name)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
            {projects.length === 0 && <p className="py-3 text-sm text-gray-500">No projects yet.</p>}
          </ul>

          <form onSubmit={handleAddProject} className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-700">Import a project</p>
            <input
              value={newProject.name}
              onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
              placeholder="Project name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={newProject.link}
              onChange={(e) => setNewProject((p) => ({ ...p, link: e.target.value }))}
              placeholder="Repository link (e.g. GitHub URL)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <button type="submit" className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
              Add project
            </button>
          </form>
        </Modal>
      )}

      {/* Certifications modal */}
      {openModal === 'certifications' && (
        <Modal title="Manage certifications" onClose={() => setOpenModal(null)}>
          <ul className="divide-y divide-gray-100 mb-5">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.sub}</p>
                </div>
                <button
                  onClick={() => handleRemoveCertification(c.name)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
            {certifications.length === 0 && <p className="py-3 text-sm text-gray-500">No certifications yet.</p>}
          </ul>

          <form onSubmit={handleAddCertification} className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-700">Import a certificate</p>
            <input
              value={newCertification.name}
              onChange={(e) => setNewCertification((c) => ({ ...c, name: e.target.value }))}
              placeholder="Certificate name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={newCertification.sub}
              onChange={(e) => setNewCertification((c) => ({ ...c, sub: e.target.value }))}
              placeholder="Issuer (optional)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <button type="submit" className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
              Add certificate
            </button>
          </form>
        </Modal>
      )}

      {/* Verification details modal */}
      {openModal === 'verification' && (
        <Modal title="Verification details" onClose={() => setOpenModal(null)}>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              A verified profile means your identity, skills and assessment results have been confirmed by Credify.
            </p>
            <div>
              <p className="font-semibold text-gray-900 mb-1">To get verified, you need to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Complete at least one technical assessment with a passing score</li>
                <li>Confirm your email address and phone number</li>
                <li>Keep your education details accurate and up to date</li>
                <li>Avoid any flagged or suspicious activity during assessments</li>
              </ul>
            </div>
            <p className="text-xs text-gray-500">
              Verification badges refresh automatically whenever your skills or results change.
            </p>
          </div>
        </Modal>
      )}

      {/* Account settings modal */}
      {openModal === 'accountSettings' && (
        <Modal title="Account settings" onClose={() => setOpenModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setOpenModal(null)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="flex gap-2">
                <input
                  value={account.email}
                  onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                />
                {account.email && (
                  <button
                    type="button"
                    onClick={() => setAccount((a) => ({ ...a, email: '' }))}
                    className="text-xs font-semibold text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone number</label>
              <div className="flex gap-2">
                <input
                  value={account.phone}
                  onChange={(e) => setAccount((a) => ({ ...a, phone: e.target.value }))}
                  placeholder="+94 7X XXX XXXX"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                />
                {account.phone && (
                  <button
                    type="button"
                    onClick={() => setAccount((a) => ({ ...a, phone: '' }))}
                    className="text-xs font-semibold text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <button type="submit" className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
              Save changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}