// src/pages/AdminUsersPage.jsx
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

const users = [
  { initials: 'NS', name: 'Nisha Saduni', email: 'saduni34@gmail.com', type: 'Candidate', role: 'Backend developer', registered: '05/07/2026' },
  { initials: 'RN', name: 'Raj Nazeer', email: 'rajnazeer@gmail.com', type: 'Recruiter', role: 'IT recruiter', registered: '06/07/2026' },
  { initials: 'PK', name: 'Pethum Kamal', email: 'kamalpathum@gmail.com', type: 'Candidate', role: 'Backend developer', registered: '08/08/2026' },
  { initials: 'SS', name: 'Saku Seya', email: 'sakuseya@gmail.com', type: 'Recruiter', role: 'IT recruiter', registered: '09/08/2026' },
  { initials: 'NS', name: 'Nimal Sadun', email: 'nimalsadun@gmail.com', type: 'Recruiter', role: 'IT recruiter', registered: '19/09/2026' },
]

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage candidates, recruiters and admins on the platform.</p>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Total users</p>
              <p className="text-3xl font-bold text-slate-900">2,486</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">↑ 12.5%</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Candidates</p>
              <p className="text-3xl font-bold text-slate-900">2,214</p>
              <p className="text-xs text-slate-500 mt-2">89% of users</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recruiters</p>
              <p className="text-3xl font-bold text-slate-900">248</p>
              <p className="text-xs text-slate-500 mt-2">10% of users</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Admins</p>
              <p className="text-3xl font-bold text-slate-900">24</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ All active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">Search and filters</h2>
            <div className="flex gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                <option>User type</option>
                <option>Candidate</option>
                <option>Recruiter</option>
                <option>Admin</option>
              </select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                <option>Account status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                <option>Registration date</option>
              </select>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs">
                  <th className="pb-2 font-semibold">User</th>
                  <th className="pb-2 font-semibold">Email</th>
                  <th className="pb-2 font-semibold">Account type</th>
                  <th className="pb-2 font-semibold">Career role</th>
                  <th className="pb-2 font-semibold">Verification</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Registered</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.email + i} className="border-t border-slate-100">
                    <td className="py-3 flex items-center gap-2 font-semibold text-slate-900">
                      <span className="w-7 h-7 rounded-full bg-blue-50 text-primary text-[10px] font-semibold flex items-center justify-center">{u.initials}</span>
                      {u.name}
                    </td>
                    <td className="text-slate-600">{u.email}</td>
                    <td className="text-slate-900">{u.type}</td>
                    <td className="text-slate-600">{u.role}</td>
                    <td><span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">✓ Verified</span></td>
                    <td><span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">Active</span></td>
                    <td className="text-slate-600">{u.registered}</td>
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
            <p className="text-xs text-slate-500 mt-4">Showing {users.length} of 2,486 users</p>
          </div>
        </main>
      </div>
    </div>
  )
}