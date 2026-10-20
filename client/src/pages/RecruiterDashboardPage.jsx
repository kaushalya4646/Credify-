// src/pages/RecruiterDashboardPage.jsx
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

const jobs = [
  { title: 'Inventory Engineer', apps: 12, match: 70, status: 'Available' },
  { title: 'Backend Engineer', apps: 145, match: 88, status: 'Available' },
  { title: 'Frontend Engineer', apps: 26, match: 55, status: 'Available' },
  { title: 'Backend Management', apps: 19, match: 32, status: 'Available' },
  { title: 'Frontend Engineer', apps: 13, match: 22, status: 'In process' },
]

export default function RecruiterDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Recruiter Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your recruitment activities and discover verified talent</p>
          </div>
          <Link to="/recruiter/jobs/create" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            Create job
          </Link>
        </header>

        <main className="p-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Overall recruiter status overview</h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Active jobs</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-xs text-green-700 font-semibold mt-2">↑ 14.2%</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Applications</p>
                <p className="text-3xl font-bold text-slate-900">145</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">↑ 13.7%</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Recommended candidates</p>
                <p className="text-3xl font-bold text-slate-900">28</p>
                <p className="text-xs text-slate-500 mt-2">Top roles: Senior Frontend, Backend</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Saved candidates</p>
                <p className="text-3xl font-bold text-slate-900">35</p>
                <div className="h-1.5 rounded-full bg-slate-100 mt-2">
                  <div className="h-1.5 rounded-full bg-green-600" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Recommended candidates</h3>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Danee Smith</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <p className="text-xs text-slate-500">Senior Frontend Engineer</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Kavindu Silva</span>
                  <span className="font-bold text-slate-900">88%</span>
                </div>
                <p className="text-xs text-slate-500">Backend Engineer</p>
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Active job vacancies</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs">
                    <th className="pb-2 font-semibold">Job title</th>
                    <th className="pb-2 font-semibold">Applications</th>
                    <th className="pb-2 font-semibold">Skills</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.title + job.status} className="border-t border-slate-100">
                      <td className="py-3 font-semibold text-slate-900">{job.title}</td>
                      <td className="text-slate-600">{job.apps}</td>
                      <td>
                        <div className="h-1.5 w-24 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-green-600" style={{ width: `${job.match}%` }} />
                        </div>
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}