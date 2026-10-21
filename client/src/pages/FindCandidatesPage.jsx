// src/pages/FindCandidatesPage.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'Find Candidates', path: '/recruiter/find-candidates' },
  { label: 'Create Jobs', path: '/recruiter/jobs/create' },
  { label: 'Saved Candidates', path: '/recruiter/saved-candidates' },
  { label: 'My Profile', path: '/recruiter/profile' },
]

function RecruiterSidebar() {
  const location = useLocation()
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col">
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
                active ? 'bg-blue-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Here to help you grow</p>
        <p className="text-xs text-slate-500 mt-2">Get help with your profile, skills and assessments.</p>
        <a href="#" className="text-xs font-medium text-primary mt-3 inline-block">Visit help center ↗</a>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">MP</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">M Perera</p>
          <p className="text-xs text-slate-500">Recruiter account</p>
        </div>
      </div>
      <div className="px-6 pb-4">
        <Link to="/" className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Log out
        </Link>
      </div>
    </aside>
  )
}

const filters = ['Career role', 'Technical skills', 'Verified skills', 'Experience', 'Assessment score', 'Education']

const verifiedSkills = [
  { name: 'Java', pct: 40 },
  { name: 'Spring Boot', pct: 90 },
  { name: 'SQL', pct: 70 },
  { name: 'REST APIs', pct: 75 },
]

export default function FindCandidatesPage() {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('Career role')

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">Find Candidates</h1>
          <p className="text-sm text-slate-500 mt-1">Search verified candidates by skills, role or keywords</p>
        </header>

        <main className="p-10">
          <div className="flex gap-3 mb-5">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by skills, role or keywords…"
              className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-sm"
            />
            <button className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">Search</button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  activeFilter === f ? 'bg-blue-50 border-primary text-primary' : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-primary">CS</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">Chethina Sri</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ Verified</span>
                  </div>
                  <p className="text-sm text-slate-500">Backend Developer</p>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e9f0" strokeWidth="9" />
                    <circle
                      cx="50" cy="50" r="38" fill="none" stroke="#16a34a" strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38 * 0.92} ${2 * Math.PI * 38}`}
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-slate-900">92%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Match</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Verified skills</h3>
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
                        <div className="h-1.5 rounded-full bg-green-600" style={{ width: `${skill.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              <button className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
                View full profile
              </button>
              <button className="flex-1 py-3.5 rounded-xl bg-blue-50 border border-blue-100 text-primary font-semibold text-sm">
                Explore other candidates
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}