import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'


const navItems = [
  { label: 'Dashboard', path: '/candidate/dashboard' },
  { label: 'Career Role', path: '/candidate/career-role' },
  { label: 'Assessments', path: '/candidate/assessments' },
  { label: 'Skill Gaps', path: '/candidate/skill-gaps' },
  { label: 'My Profile', path: '/candidate/profile' },
]

const subNav = [
  { label: 'Technical assessments', path: '/candidate/assessments' },
  { label: 'Assessment results', path: '/candidate/assessments/results' },
  { label: 'Assessment screen', path: '/candidate/assessments/screen' },
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
          const active = location.pathname === item.path
          const isAssessments = item.path === '/candidate/assessments'
          const assessmentsExpanded = location.pathname.startsWith('/candidate/assessments')
          return (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                  active || (isAssessments && assessmentsExpanded) ? 'bg-blue-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
              {isAssessments && assessmentsExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {subNav.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={`block px-3 py-1.5 text-xs font-medium rounded-lg ${
                        location.pathname === sub.path ? 'text-primary font-semibold' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Here to help you grow</p>
        <p className="text-xs text-slate-500 mt-2">Get help with your profile, skills and assessments.</p>
        <a href="#" className="text-xs font-medium text-primary mt-3 inline-block">Visit help center ↗</a>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">CS</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">Chethina Sri</p>
          <p className="text-xs text-slate-500">Candidate account</p>
        </div>
      </div>
    </aside>
  )
}

const questions = [
  {
    text: 'Which concept allows a class to acquire properties and methods from another class?',
    options: ['Encapsulation', 'Inheritance', 'Abstraction', 'Polymorphism'],
    correct: 1,
  },
  // TODO: replace with real question bank fetched from the backend, 28 questions for this assessment
]

export default function AssessmentScreenPage() {
  const totalQuestions = 28
  const [currentIndex, setCurrentIndex] = useState(6) // question 7, zero-indexed
  const [answers, setAnswers] = useState({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 6: 1 }) // mock answered set
  const question = questions[0] // placeholder: same question shown regardless of index until wired up

  function selectAnswer(optionIndex) {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }))
  }

  function goTo(index) {
    setCurrentIndex(index)
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateSidebar />
      <div className="ml-60 p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                <path d="M7 10l3 2.5-3 2.5M12.5 15.5H17" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Java Programming Assessment</h1>
              <p className="text-sm text-slate-500">Level: Elementary</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">Question {currentIndex + 1} of {totalQuestions}</p>
              <div className="w-60 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">{answeredCount} answered</p>
            </div>
            <div className="border-l border-slate-200 pl-8">
              <p className="text-xs text-slate-500 mb-1">Time remaining</p>
              <p className="text-2xl font-bold text-slate-900">18:44</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-primary mb-4">Question {String(currentIndex + 1).padStart(2, '0')}</p>
            <h2 className="text-xl font-semibold text-slate-900 mb-8">{question.text}</h2>
            <div className="space-y-4">
              {question.options.map((option, i) => {
                const selected = answers[currentIndex] === i
                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-left px-5 py-4 rounded-xl border flex items-center gap-3 ${
                      selected ? 'bg-blue-50 border-primary' : 'border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-primary bg-primary' : 'border-slate-400'}`} />
                    <span className={`font-medium ${selected ? 'text-primary' : 'text-slate-900'}`}>
                      {String.fromCharCode(65 + i)}. {option}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={() => goTo(Math.max(0, currentIndex - 1))}
                className="px-8 py-3 rounded-xl border border-primary text-primary font-semibold text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => goTo(Math.min(totalQuestions - 1, currentIndex + 1))}
                className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Question navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const isAnswered = answers[i] !== undefined
                const isCurrent = i === currentIndex
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-10 rounded-lg text-sm font-semibold border ${
                      isCurrent
                        ? 'bg-blue-50 border-primary border-2 text-primary'
                        : isAnswered
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 space-y-2 text-xs font-medium text-slate-900">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600" /> Answered</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-primary" /> Current</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200" /> Not answered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}