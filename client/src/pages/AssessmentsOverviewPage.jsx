import { Link } from 'react-router-dom'

const steps = [
  {
    step: '1',
    title: 'Pick a track',
    text: 'Choose a skill or career role to be assessed on.',
  },
  {
    step: '2',
    title: 'Take the test',
    text: 'Timed multiple-choice and coding questions, no retakes mid-session.',
  },
  {
    step: '3',
    title: 'Get scored instantly',
    text: 'See your score and skill-gap breakdown right after submitting.',
  },
  {
    step: '4',
    title: 'Share your badge',
    text: 'Verified scores appear on your public profile for recruiters.',
  },
]

export default function AssessmentsOverviewPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <section className="bg-primary/10 py-20 text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Skills, proven — not just claimed</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Every Credify assessment is timed, proctored-style, and scored instantly against role benchmarks.
        </p>
      </section>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How an assessment works</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">35+ assessment tracks available</h3>
            <p className="text-sm text-gray-500">Java, Python, SQL, React, DevOps, and more</p>
          </div>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Browse tracks
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">Credify</Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-gray-900">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-10 text-center text-sm">
      © 2026 Credify Technologies, Inc. All rights reserved.
    </footer>
  )
}