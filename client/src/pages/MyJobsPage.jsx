// src/pages/MyJobsPage.jsx
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'Find Candidates', path: '/recruiter/find-candidates' },
  { label: 'My Jobs', path: '/recruiter/jobs' },
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
      <div className="px-6 pb-4">
        <Link to="/" className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Log out
        </Link>
      </div>
    </aside>
  )
}

const jobs = [
  { title: 'Software Engineer I', applicants: 24, status: 'Active', posted: '2 days ago' },
  { title: 'Backend Developer', applicants: null, status: 'Draft', posted: 'Not posted' },
  { title: 'Frontend Developer', applicants: 62, status: 'Closed', posted: '1 month ago' },
]

const statusStyles = {
  Active: 'bg-green-50 text-green-700',
  Draft: 'bg-slate-100 text-slate-600',
  Closed: 'bg-red-50 text-red-700',
}

export default function MyJobsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Jobs</h1>
            <p className="text-sm text-slate-500 mt-1">Manage the job vacancies you've posted.</p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Create job
          </Link>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Active jobs</p>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Drafts</p>
              <p className="text-3xl font-bold text-slate-900">3</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Closed</p>
              <p className="text-3xl font-bold text-slate-900">7</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total applicants</p>
              <p className="text-3xl font-bold text-slate-900">145</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Job title</th>
                  <th className="pb-2 font-semibold">Applicants</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Posted</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.title} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">{job.title}</td>
                    <td className="text-slate-900">{job.applicants ?? '—'}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="text-slate-600">{job.posted}</td>
                    <td>
                      <div className="flex gap-2 text-slate-400">
                        <button className="text-primary">✎</button>
                        <button className="text-red-600">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}