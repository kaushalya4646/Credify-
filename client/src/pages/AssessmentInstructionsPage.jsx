// src/pages/AssessmentInstructionsPage.jsx
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'

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

const assessmentInfo = {
  name: 'Java Programming',
  difficulty: 'Intermediate',
  duration: '30 minutes',
  questions: 20,
  passingScore: '50%',
  attempts: 1,
}

export default function AssessmentInstructionsPage() {
  const { id } = useParams() // TODO: fetch assessment by this id
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">{assessmentInfo.name} Assessment</h1>
          <p className="text-sm text-slate-500 mt-1">Review the details before you begin.</p>
        </header>

        <main className="p-10 flex justify-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-2xl">
              ☕
            </div>
            <h2 className="text-xl font-semibold text-slate-900 text-center">{assessmentInfo.name}</h2>
            <p className="text-sm text-slate-500 text-center mb-6">{assessmentInfo.difficulty} difficulty</p>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-900">{assessmentInfo.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Questions</span>
                <span className="font-semibold text-slate-900">{assessmentInfo.questions} questions</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Passing score</span>
                <span className="font-semibold text-slate-900">{assessmentInfo.passingScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Attempts allowed</span>
                <span className="font-semibold text-slate-900">{assessmentInfo.attempts}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-5 pt-5 space-y-1.5">
              <p className="text-xs text-slate-500">• The timer starts as soon as you begin.</p>
              <p className="text-xs text-slate-500">• You cannot pause once started.</p>
              <p className="text-xs text-slate-500">• Make sure you have a stable connection.</p>
            </div>

            <button
              onClick={() => navigate('/candidate/assessments/screen')}
              className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
            >
              Begin assessment
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}