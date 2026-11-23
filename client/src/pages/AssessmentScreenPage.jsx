import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'

const navItems = [
  { label: 'Dashboard', path: '/candidate/dashboard' },
  { label: 'Career Role', path: '/candidate/career-role' },
  { label: 'Assessments', path: '/candidate/assessments' },
  { label: 'Skill Gaps', path: '/candidate/skill-gaps' },
  { label: 'My Profile', path: '/candidate/profile' },
]

function CandidateSidebar({ activeId }) {
  const location = useLocation()
  const subNav = [
    { label: 'Technical assessments', path: '/candidate/assessments' },
    { label: 'Assessment results', path: '/candidate/assessments' },
    { label: 'Assessment screen', path: `/candidate/assessments/${activeId}/screen` },
  ]

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
                  active || (isAssessments && assessmentsExpanded) ? 'text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
              {isAssessments && assessmentsExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {subNav.map((sub) => (
                    <Link
                      key={sub.label}
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
    </aside>
  )
}

function formatClock(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function MessageScreen({ title, message }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-sm">
        <h1 className="text-lg font-semibold text-slate-900 mb-2">{title}</h1>
        {message && <p className="text-sm text-slate-500 mb-6">{message}</p>}
        <Link to="/candidate/assessments" className="text-primary font-semibold text-sm">
          Back to assessments
        </Link>
      </div>
    </div>
  )
}

export default function AssessmentScreenPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // questionId -> answer text
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Elapsed time is measured from when the questions finish loading.
  const startedAt = useRef(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const data = await api.get(`/api/assessments/${id}`)
        setAssessment(data)
        setCurrentIndex(0)
        setAnswers({})
        startedAt.current = Date.now()
        setElapsed(0)
      } catch (err) {
        console.error('Failed to load assessment:', err)
        setLoadError(err.message || 'Could not load this assessment.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (!assessment) return
    const timer = setInterval(() => {
      if (startedAt.current) setElapsed(Math.floor((Date.now() - startedAt.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [assessment])

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading assessment…</div>
  }

  if (loadError) {
    return <MessageScreen title="Assessment not found" message={loadError} />
  }

  const questions = assessment?.questions || []
  if (questions.length === 0) {
    return <MessageScreen title="No questions yet" message="This assessment doesn't have any questions yet. Please check back later." />
  }

  const { title, difficulty, durationMinutes } = assessment
  const totalQuestions = questions.length
  const question = questions[currentIndex]
  const options = Array.isArray(question.options) ? question.options : []
  const answeredCount = questions.filter((q) => answers[q.id] != null && answers[q.id] !== '').length
  const unansweredCount = totalQuestions - answeredCount
  const isLast = currentIndex === totalQuestions - 1
  const remaining = durationMinutes != null ? durationMinutes * 60 - elapsed : null

  function setAnswer(value) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function goTo(index) {
    setCurrentIndex(Math.min(Math.max(0, index), totalQuestions - 1))
  }

  async function submit() {
    if (submitting || answeredCount === 0) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const payload = {
        answers: questions
          .filter((q) => answers[q.id] != null && answers[q.id] !== '')
          .map((q) => ({ questionId: q.id, answer: answers[q.id] })),
        timeTakenSeconds: Math.floor((Date.now() - startedAt.current) / 1000),
      }
      const attempt = await api.post(`/api/assessments/${id}/attempts`, payload)
      navigate(`/candidate/assessments/results/${attempt.id}`)
    } catch (err) {
      console.error('Failed to submit attempt:', err)
      setSubmitError(err.message || 'Could not submit your answers. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateSidebar activeId={id} />
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
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">Level: {difficulty}</p>
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
              <p className="text-xs text-slate-500 mb-1">{remaining != null ? 'Time remaining' : 'Time elapsed'}</p>
              <p className={`text-2xl font-bold ${remaining != null && remaining <= 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatClock(remaining != null ? remaining : elapsed)}
              </p>
              {remaining != null && remaining <= 0 && <p className="text-xs text-red-600">Time's up — please submit</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-primary mb-4">Question {String(currentIndex + 1).padStart(2, '0')}</p>
            <h2 className="text-xl font-semibold text-slate-900 mb-8">{question.questionText}</h2>
            {options.length > 0 ? (
              <div className="space-y-4">
                {options.map((option, i) => {
                  const selected = answers[question.id] === option
                  return (
                    <button
                      key={`${question.id}-${i}`}
                      onClick={() => setAnswer(option)}
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
            ) : (
              // Questions without options are free-text answers.
              <input
                value={answers[question.id] || ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer"
                className="w-full px-5 py-4 rounded-xl border border-slate-300 text-sm"
              />
            )}

            <div className="flex justify-between mt-10">
              <button
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-8 py-3 rounded-xl border border-primary text-primary font-semibold text-sm disabled:opacity-40"
              >
                Previous
              </button>
              {isLast ? (
                <button
                  onClick={submit}
                  disabled={submitting || answeredCount === 0}
                  className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit assessment'}
                </button>
              ) : (
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  className="px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
                >
                  Next
                </button>
              )}
            </div>
            {isLast && answeredCount === 0 && (
              <p className="mt-3 text-right text-xs text-slate-500">Answer at least one question to submit.</p>
            )}
            {isLast && answeredCount > 0 && unansweredCount > 0 && (
              <p className="mt-3 text-right text-xs text-amber-700">
                {unansweredCount} unanswered question{unansweredCount === 1 ? '' : 's'} will be marked incorrect.
              </p>
            )}
            {submitError && <p className="mt-3 text-right text-sm text-red-600">{submitError}</p>}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Question navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] != null && answers[q.id] !== ''
                const isCurrent = i === currentIndex
                return (
                  <button
                    key={q.id}
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
            <button
              onClick={submit}
              disabled={submitting || answeredCount === 0}
              className="mt-6 w-full py-3 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-blue-50 disabled:opacity-40"
            >
              {submitting ? 'Submitting…' : 'Submit assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
