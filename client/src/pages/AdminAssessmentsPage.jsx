// src/pages/AdminAssessmentsPage.jsx
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

const assessments = [
  { name: 'Java Programming', skill: 'Java', difficulty: 'Intermediate', questions: 20, attempts: 1284, avg: '78%', status: 'Active', updated: '1 min ago' },
  { name: 'SQL Fundamentals', skill: 'SQL', difficulty: 'Intermediate', questions: 15, attempts: 964, avg: '71%', status: 'Active', updated: '14 hours ago' },
  { name: 'REST API Development', skill: 'REST APIs', difficulty: 'Advanced', questions: 20, attempts: 486, avg: '68%', status: 'Active', updated: '1 day ago' },
]

export default function AdminAssessmentsPage() {
  const [searchText, setSearchText] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Assessments</h1>
            <p className="text-sm text-slate-500 mt-1">Create, manage and monitor technical skill assessments.</p>
          </div>
           <Link to='/admin-assessments-editor-page' className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Create assessment</Link>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total assessments</p>
              <p className="text-3xl font-bold text-slate-900">42</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">↑ 12.7%</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Active assessments</p>
              <p className="text-3xl font-bold text-slate-900">36</p>
              <p className="text-xs text-slate-500 mt-2">of 42 total</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Completed attempts</p>
              <p className="text-3xl font-bold text-slate-900">8,426</p>
              <p className="text-xs text-slate-500 mt-2">Across all assessments</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Average score</p>
              <p className="text-3xl font-bold text-slate-900">74%</p>
              <p className="text-xs text-slate-500 mt-2">Across completed attempts</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">Search and filters</h2>
            <div className="flex gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search assessments"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Skill</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Difficulty</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Status</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Assessment type</option></select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Assessment</th>
                  <th className="pb-2 font-semibold">Skill</th>
                  <th className="pb-2 font-semibold">Difficulty</th>
                  <th className="pb-2 font-semibold">Questions</th>
                  <th className="pb-2 font-semibold">Attempts</th>
                  <th className="pb-2 font-semibold">Average</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Last updated</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.name} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">{a.name}</td>
                    <td><span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">✓ {a.skill}</span></td>
                    <td className="text-slate-600">{a.difficulty}</td>
                    <td className="text-slate-900">{a.questions}</td>
                    <td className="text-slate-900">{a.attempts.toLocaleString()}</td>
                    <td className="font-semibold text-slate-900">{a.avg}</td>
                    <td><span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">{a.status}</span></td>
                    <td className="text-slate-600">{a.updated}</td>
                    <td>
                      <div className="flex gap-2 text-slate-400">
                        <button>⋯</button>
                        <button className="text-primary">✎</button>
                        <button className="text-red-600">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-4">Showing {assessments.length} of 42 assessments</p>
          </div>
        </main>
      </div>
    </div>
  )
}