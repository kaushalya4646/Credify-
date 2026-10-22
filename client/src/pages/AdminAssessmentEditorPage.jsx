// src/pages/AdminAssessmentEditorPage.jsx
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

const initialQuestions = [
  {
    id: 1,
    prompt: 'Which concept allows a class to acquire properties and methods from another class?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correctIndex: 1,
  },
  {
    id: 2,
    prompt: 'What keyword is used to inherit a class in Java?',
    options: ['implements', 'extends', 'inherits', 'super'],
    correctIndex: 1,
  },
]

export default function AdminAssessmentEditorPage() {
  const [questions, setQuestions] = useState(initialQuestions)
  const [passingScore, setPassingScore] = useState(50)

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), prompt: '', options: ['', '', '', ''], correctIndex: 0 },
    ])
  }

  function removeQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Java Programming — Questions</h1>
            <p className="text-sm text-slate-500 mt-1">Add, edit and order the question bank for this assessment.</p>
          </div>
          <button
            onClick={addQuestion}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Add question
          </button>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">QUESTION {index + 1}</span>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-xs font-semibold">MCQ</span>
                    <button className="text-primary text-xs font-medium">Edit</button>
                    <button onClick={() => removeQuestion(q.id)} className="text-red-600 text-xs font-medium">Delete</button>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-2">{q.prompt || 'Untitled question'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {q.options.map((opt, i) => (
                    <span key={i} className={i === q.correctIndex ? 'text-green-700 font-semibold' : 'text-slate-500'}>
                      {i === q.correctIndex ? '✓ ' : ''}{String.fromCharCode(65 + i)}. {opt || '(empty)'}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-400 hover:text-primary hover:border-primary"
            >
              + Add another question
            </button>

            <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Passing score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
                <span className="text-sm text-slate-600">%</span>
              </div>
              <button className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
                Publish assessment
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}