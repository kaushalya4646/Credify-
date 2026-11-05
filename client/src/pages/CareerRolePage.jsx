//careerRolePage
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Career Role', to: '/candidate/career-role' },
  { label: 'Assessments', to: '/candidate/assessments' },
  { label: 'Skill Gaps', to: '/candidate/skill-gaps' },
  { label: 'My Profile', to: '/candidate/profile' },
]

const categories = ['Software development', 'Data science & AI', 'Cloud & DevOps', 'Quality assurance', 'UX/UI']

// TODO (backend step): replace with career roles from the API, filtered by category and search text.
const roles = [
  {
    name: 'Backend developer',
    desc: 'API, database and server-side development',
    skillsRequired: 12,
    icons: [{ bg: '#DCFCE7', fg: '#15803D', glyph: '🗄' }, { bg: '#DBEAFE', fg: '#2563EB', glyph: '⚙' }],
  },
  {
    name: 'Frontend developer',
    desc: 'Web interfaces and front-end technologies',
    skillsRequired: 14,
    icons: [{ bg: '#FFE4D6', fg: '#C2410C', glyph: '🖼' }, { bg: '#FFE4D6', fg: '#C2410C', glyph: '🧩' }],
  },
  {
    name: 'Full stack developer',
    desc: 'Front-end and back-end development',
    skillsRequired: 26,
    icons: [{ bg: '#DCFCE7', fg: '#15803D', glyph: '🗄' }, { bg: '#FFE4D6', fg: '#C2410C', glyph: '🖼' }],
  },
  {
    name: 'Data analyst',
    desc: 'Data analysis, visualization and SQL',
    skillsRequired: 10,
    icons: [{ bg: '#DCFCE7', fg: '#15803D', glyph: '🗄' }, { bg: '#DBEAFE', fg: '#2563EB', glyph: '📊' }],
  },
]

const notifications = [
  { title: 'New assessment recommended', detail: 'React Performance assessment is ready for you' },
  { title: 'Skill verified', detail: 'Your Python skill has been verified' },
  { title: 'Data Analysis needs verification', detail: 'Take an assessment to verify this skill' },
]

export default function CareerRolePage() {
  const { pathname } = useLocation()
  const [category, setCategory] = useState(categories[0])
  const [search, setSearch] = useState('')

  // which header dropdown is open: 'help' | 'notifications' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null)
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

  const visibleRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

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
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Choose your career role</h1>
            <p className="text-sm text-gray-500">
              Select a target role to understand the skills required and identify your skill gap.
            </p>
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
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Visit help center</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy policy</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of service</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About us</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Give feedback about Credify</a>
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
                  CS
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">Chethina Sri</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openMenu === 'profile' && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/candidate/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <div className="my-1 border-t border-gray-100" />
                  <Link to="/" className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">Log out</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {/* Search */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search career roles..."
              className="w-full border-none text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Categories */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-gray-900">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => {
                const active = category === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium ${
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Role cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {visibleRoles.map((r) => (
              <div key={r.name} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                  <span className="shrink-0 rounded-full bg-[#E8F5EE] px-3 py-1 text-xs font-semibold text-[#15803D]">
                    {r.skillsRequired} skills required
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{r.desc}</p>

                <div className="mt-4 flex gap-2">
                  {r.icons.map((ic, i) => (
                    <span
                      key={i}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
                      style={{ backgroundColor: ic.bg, color: ic.fg }}
                    >
                      {ic.glyph}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-gray-100 pt-4">
                  <a href="#" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    View details
                    <span>›</span>
                  </a>
                </div>
              </div>
            ))}
            {visibleRoles.length === 0 && (
              <p className="col-span-2 py-10 text-center text-sm text-gray-500">
                No career roles match &ldquo;{search}&rdquo;.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}