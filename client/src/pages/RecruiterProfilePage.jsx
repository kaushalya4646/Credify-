// src/pages/RecruiterProfilePage.jsx
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
    </aside>
  )
}

export default function RecruiterProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">Recruiter Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your recruiter identity and company details</p>
        </header>

        <main className="p-10 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-primary">MP</div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-semibold text-slate-900">M Perera</h2>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ Verified Profile</span>
                </div>
                <p className="text-slate-500">IT Recruiter</p>
                <p className="text-sm text-slate-500">TechVision Solutions · Colombo, Sri Lanka</p>
              </div>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Edit profile</button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-slate-900">Recruiter information</h3>
                <button className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold">Edit information</button>
              </div>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Full name</p>
                  <p className="font-semibold text-slate-900">M Perera</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Job title</p>
                  <p className="font-semibold text-slate-900">IT Recruiter</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company</p>
                  <p className="font-semibold text-slate-900">TechVision Solutions</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Work email</p>
                  <p className="font-semibold text-primary">nethmi@techvision.lk</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="font-semibold text-slate-900">+94 71 2345678</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="font-semibold text-slate-900">Colombo, Sri Lanka</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Experience</p>
                  <p className="font-semibold text-slate-900">5 years in technology recruitment</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-slate-900">Company information</h3>
                <button className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold">Edit information</button>
              </div>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company name</p>
                  <p className="font-semibold text-slate-900">TechVision Solutions</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Industry</p>
                  <p className="font-semibold text-slate-900">Information Technology</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company size</p>
                  <p className="font-semibold text-slate-900">25–100 employees</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="font-semibold text-slate-900">Colombo, Sri Lanka</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Website</p>
                  <p className="font-semibold text-primary">www.techvision.lk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              ['8', 'Active jobs'],
              ['25', 'Saved candidates'],
              ['15', 'Candidates contacted'],
              ['5', 'Hires completed'],
            ].map(([num, label]) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{num}</p>
                  <p className="text-sm text-slate-500 mt-1">{label}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">●</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}