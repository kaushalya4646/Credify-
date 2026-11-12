import { Link } from 'react-router-dom'

const openings = [
  { title: 'Senior Backend Engineer', meta: 'Colombo · Full-time · Engineering' },
  { title: 'Product Designer', meta: 'Remote · Full-time · Design' },
  { title: 'Talent Partnerships Lead', meta: 'Colombo · Full-time · Sales' },
  { title: 'QA Engineer, Assessments', meta: 'Colombo · Full-time · Engineering' },
]

const perks = ['Remote-friendly', 'Health benefits', 'Learning budget', 'Equity options']

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Join the Credify team</h1>
          <p className="text-gray-500 mt-3">Help us build the future of skill-based hiring.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_240px] gap-8">
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{job.meta}</p>
                </div>
                <button className="px-5 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20">
                  Apply
                </button>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
            <p className="text-xs font-semibold text-gray-500 mb-3">WHY CREDIFY</p>
            <ul className="space-y-3 text-sm text-gray-600">
              {perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </aside>
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