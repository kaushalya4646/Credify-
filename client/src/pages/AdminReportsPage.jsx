import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Career Roles', path: '/admin/career-roles' },
  { label: 'Skills', path: '/admin/skills' },
  { label: 'Assessments', path: '/admin/assessments' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'System Settings', path: '/admin/settings' },
]

function AdminSidebar() {
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
      <p className="px-6 text-[11px] tracking-wide text-slate-500">ADMIN WORKSPACE</p>
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
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">AU</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
          <p className="text-xs text-slate-500">Admin account</p>
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

const popularRoles = [
  { name: 'Senior Frontend Engineer', count: 30, pct: 100 },
  { name: 'Backend Developer', count: 22, pct: 73 },
  { name: 'Data Scientist', count: 17, pct: 57 },
  { name: 'Full-Stack Developer', count: 12, pct: 40 },
  { name: 'Senior Backend Engineer', count: 8, pct: 27 },
]

const availableReports = ['User activity', 'Assessment performance', 'Career role trends', 'Skill verification trends', 'Recruiter activity']

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Reports and analytics</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor platform activity, skill verification and recruitment trends.</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Export report</button>
        </header>

        <main className="p-10 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
            <select className="px-4 py-2.5 rounded-xl border border-primary bg-blue-50 text-primary text-sm font-semibold"><option>Last 7 days</option></select>
            <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>User type</option></select>
            <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Career role</option></select>
            <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Skill category</option></select>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total users</p>
              <p className="text-3xl font-bold text-slate-900">280</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">↑ 12% vs previous period</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Assessments completed</p>
              <p className="text-3xl font-bold text-slate-900">1,842</p>
              <p className="text-xs text-slate-500 mt-2">Pass rate 74%</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Skills verified</p>
              <p className="text-3xl font-bold text-slate-900">4,628</p>
              <p className="text-xs text-slate-500 mt-2">Verification rate 67%</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recruiter activity</p>
              <p className="text-3xl font-bold text-slate-900">734</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">↑ 9%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900">User registration trends</h3>
              <p className="text-sm text-slate-500 mb-4">New registrations over time</p>
              <p className="text-sm text-slate-400 italic">Line chart renders here (recharts recommended).</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900">Assessment activity</h3>
              <p className="text-sm text-slate-500 mb-4">Completed assessments by week</p>
              <p className="text-sm text-slate-400 italic">Bar chart renders here (recharts recommended).</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-1">Popular career roles</h3>
              <p className="text-sm text-slate-500 mb-4">Career role selections</p>
              <div className="space-y-3">
                {popularRoles.map((r) => (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{r.name}</span><span className="font-semibold text-slate-900">{r.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-1">Skill verification distribution</h3>
              <p className="text-sm text-slate-500 mb-4">Verified vs unverified skills</p>
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#d5dbe6" strokeWidth="14" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="14" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.67} ${2 * Math.PI * 40}`} />
                  </svg>
                  <span className="absolute text-xl font-bold text-slate-900">67%</span>
                </div>
                <div className="mt-4 space-y-2 w-full text-sm">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Verified — 67% of skills</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300" /> Unverified — 33% of skills</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Available reports</h3>
              <div className="space-y-1">
                {availableReports.map((r) => (
                  <button key={r} className="w-full flex items-center justify-between py-3 border-b border-slate-100 last:border-0 text-sm font-medium text-slate-900">
                    {r} <span className="text-slate-400">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}