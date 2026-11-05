// src/pages/AdminPlatformContentPage.jsx
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
          const active = item.path === '/admin/settings' ? location.pathname === '/admin/content' : location.pathname === item.path
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

const announcements = [
  { title: 'New assessments available for DevOps role', status: 'Published · 2 days ago' },
  { title: 'Scheduled maintenance this weekend', status: 'Draft' },
]

const flagged = [
  { title: 'Profile reported: suspicious project link', note: 'Reported by recruiter · Pending review' },
  { title: 'Assessment answer flagged as leaked', note: 'Reported by system · Pending review' },
]

export default function AdminPlatformContentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Platform Content</h1>
            <p className="text-sm text-slate-500 mt-1">Manage announcements, guidelines and flagged content.</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            New announcement
          </button>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Announcements</h3>
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{a.status}</p>
                    </div>
                    <button className="text-primary text-xs font-medium">Edit</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Flagged content</h3>
              <div className="space-y-3">
                {flagged.map((f) => (
                  <div key={f.title} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                      <p className="text-xs text-red-700 mt-1">{f.note}</p>
                    </div>
                    <button className="text-primary text-xs font-medium">Review</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Platform guidelines</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-600 mb-4">
                Candidate code of conduct, recruiter usage policy, and assessment integrity rules shown across the platform.
              </p>
              <button className="px-5 py-2 rounded-lg bg-blue-50 text-primary text-sm font-semibold">
                Edit guidelines
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}