// src/pages/AdminSystemSettingsPage.jsx
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

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-5.5 rounded-full relative transition-colors ${on ? 'bg-green-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function AdminSystemSettingsPage() {
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [allowRecruiterRegistration, setAllowRecruiterRegistration] = useState(true)
  const [randomizeQuestions, setRandomizeQuestions] = useState(true)
  const [skillRecommendations, setSkillRecommendations] = useState(true)
  const [careerRecommendations, setCareerRecommendations] = useState(true)
  const [candidateMatching, setCandidateMatching] = useState(true)

  function handleSave() {
    // TODO: PATCH /api/admin/settings with all the values below
    console.log('Save settings')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure platform behaviour, assessments, verification and security.</p>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">General settings</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Platform name</label>
                <input defaultValue="Credify" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Platform description</label>
                <textarea defaultValue="Industry skill verification and career readiness platform." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Default language</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>English</option></select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Time zone</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>UTC+05:30 Colombo</option></select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">User management</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Allow new registration</span>
                <Toggle on={allowRegistration} onToggle={() => setAllowRegistration((v) => !v)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Require email verification</span>
                <Toggle on={requireEmailVerification} onToggle={() => setRequireEmailVerification((v) => !v)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Allow recruiter registration</span>
                <Toggle on={allowRecruiterRegistration} onToggle={() => setAllowRecruiterRegistration((v) => !v)} />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Quick metrics</h4>
                <p className="text-xs text-slate-400 italic">Candidates vs recruiters chart renders here.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Assessment settings</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Maximum assessment duration</label>
                <div className="flex gap-2">
                  <input defaultValue="180" className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm" />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Minutes</option></select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Maximum attempts</label>
                <input defaultValue="1" className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Passing score</label>
                <input defaultValue="50%" className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Randomize questions</span>
                <Toggle on={randomizeQuestions} onToggle={() => setRandomizeQuestions((v) => !v)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Verification settings</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Verification expiry</label>
                <div className="flex gap-2">
                  <input defaultValue="Never" className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm" />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Days</option></select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Verification badges</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Allowed</option></select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Minimum score for verification</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>50%</option></select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Privacy & security</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Recruiter access controls</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>All candidates</option></select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Session timeout</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>30 minutes</option></select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Data retention</label>
                <div className="flex gap-2">
                  <input defaultValue="Never" className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm" />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"><option>Days</option></select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Recommendations</h3>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Enable skill recommendations</span>
                  <Toggle on={skillRecommendations} onToggle={() => setSkillRecommendations((v) => !v)} />
                </div>
                <p className="text-xs text-slate-500">Suggest skills to improve for a role.</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Enable career recommendations</span>
                  <Toggle on={careerRecommendations} onToggle={() => setCareerRecommendations((v) => !v)} />
                </div>
                <p className="text-xs text-slate-500">Suggest career roles that fit a profile.</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Enable candidate matching</span>
                  <Toggle on={candidateMatching} onToggle={() => setCandidateMatching((v) => !v)} />
                </div>
                <p className="text-xs text-slate-500">Match verified candidates to jobs.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">Save changes</button>
            <button className="px-6 py-3 rounded-xl border border-primary text-primary font-semibold text-sm">Reset changes</button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-semibold text-red-800 mb-1">⚠ Danger zone</h3>
            <p className="text-sm text-red-700 mb-4">These actions can affect the entire platform.</p>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">Disable platform</button>
              <button className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">Reset system data</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}