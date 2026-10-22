// src/pages/AdminSkillsPage.jsx
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

const skillCategories = [
  { category: 'Programming', skills: ['Java', 'Python'], usage: '1,248 candidates' },
  { category: 'Database management', skills: ['SQL', 'PostgreSQL'], usage: '864 candidates' },
  { category: 'API development', skills: ['REST APIs', 'API Testing'], usage: '742 candidates' },
]

export default function AdminSkillsPage() {
  const [searchText, setSearchText] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Skills</h1>
            <p className="text-sm text-slate-500 mt-1">Manage the skill taxonomy used across career roles and assessments.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Add skill</button>
            <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">Add skill category</button>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total skills</p>
              <p className="text-3xl font-bold text-slate-900">86</p>
              <p className="text-xs text-slate-500 mt-2">Across all categories</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Skill categories</p>
              <p className="text-3xl font-bold text-slate-900">12</p>
              <p className="text-xs text-slate-500 mt-2">Macro skills</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Verified skills</p>
              <p className="text-3xl font-bold text-slate-900">64</p>
              <p className="text-xs text-slate-500 mt-2">74% of all skills</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recently added</p>
              <p className="text-3xl font-bold text-slate-900">7</p>
              <p className="text-xs text-slate-500 mt-2">In the last 30 days</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">Skill structure</h2>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 text-xs text-slate-500 font-semibold">
              <span>Macro skill</span><span>Micro skills</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Database management</span>
              <div className="flex gap-2">
                {['SQL', 'PostgreSQL', 'Database design', 'Query optimization'].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">Search and filters</h2>
            <div className="flex gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search skills"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Skill category</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Skill type</option></select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Status</option></select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Micro skills</th>
                  <th className="pb-2 font-semibold">Usage</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skillCategories.map((c) => (
                  <tr key={c.category} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-900">{c.category}</td>
                    <td>
                      <div className="flex gap-2">
                        {c.skills.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-medium">✓ {s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="text-slate-600">{c.usage}</td>
                    <td><span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">Active</span></td>
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
            <p className="text-xs text-slate-500 mt-4">Showing {skillCategories.length} of 12 categories</p>
          </div>
        </main>
      </div>
    </div>
  )
}