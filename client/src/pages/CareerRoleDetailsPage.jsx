import { Link, useLocation, useParams } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/candidate/dashboard' },
  { label: 'Career Role', path: '/candidate/career-role' },
  { label: 'Assessments', path: '/candidate/assessments' },
  { label: 'Skill Gaps', path: '/candidate/skill-gaps' },
  { label: 'My Profile', path: '/candidate/profile' },
]

function CandidateSidebar() {
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
      <p className="px-6 text-[11px] tracking-wide text-slate-500">CANDIDATE WORKSPACE</p>
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path)
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

// Placeholder data — swap for a lookup by `id` once connected to the backend
const roleDetails = {
  name: 'Backend Developer',
  category: 'Software Development',
  requiredSkills: [
    { name: 'Java', pct: 80 },
    { name: 'Node.js', pct: 60 },
    { name: 'SQL', pct: 70 },
    { name: 'Spring Boot', pct: 30 },
    { name: 'REST APIs', pct: 20 },
  ],
}

export default function CareerRoleDetailsPage() {
  const { id } = useParams() // TODO: fetch role by this id

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">{roleDetails.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{roleDetails.category} · Required skills for this career role</p>
        </header>

        <main className="p-10 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="font-medium text-slate-900 mb-6">Required skills</h3>
            <div className="space-y-5">
              {roleDetails.requiredSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm font-semibold text-slate-900 mb-1">
                    <span>{skill.name}</span>
                    <span className="text-slate-500 font-normal">{skill.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      className={`h-2.5 rounded-full ${skill.pct >= 60 ? 'bg-green-600' : skill.pct >= 40 ? 'bg-amber-500' : 'bg-red-600'}`}
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              to="/candidate/career-role"
              className="px-8 py-3 rounded-xl bg-blue-50 border border-primary text-primary font-semibold text-sm text-center"
            >
              Back to roles
            </Link>
            <Link
              to="/candidate/assessments"
              className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark text-center"
            >
              Start an assessment
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}