// src/pages/AdminVerificationRecordsPage.jsx
import { useState } from 'react'
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
          const active = location.pathname === item.path || (item.path === '/admin/skills' && location.pathname === '/admin/verification')
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

const records = [
  { candidate: 'Chethina Sri', skill: 'Java', score: '95%', date: '09/04/2026', status: 'Verified' },
  { candidate: 'Raveen Caldera', skill: 'SQL', score: '42%', date: '11/04/2026', status: 'Flagged' },
]

const statusStyles = {
  Verified: 'bg-green-50 text-green-700',
  Flagged: 'bg-red-50 text-red-700',
}

export default function AdminVerificationRecordsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">Verification Records</h1>
          <p className="text-sm text-slate-500 mt-1">Review, correct or revoke candidates' issued skill verifications.</p>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex gap-4 mb-5">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate or skill"
                className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Skill</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Status</option></select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Candidate</th>
                  <th className="pb-2 font-semibold">Skill</th>
                  <th className="pb-2 font-semibold">Score</th>
                  <th className="pb-2 font-semibold">Verified on</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.candidate + r.skill} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">{r.candidate}</td>
                    <td className="text-slate-900">{r.skill}</td>
                    <td className="text-slate-900">{r.score}</td>
                    <td className="text-slate-600">{r.date}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="text-primary text-xs font-medium mr-4">Review</button>
                      <button className="text-red-600 text-xs font-medium">Revoke</button>
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