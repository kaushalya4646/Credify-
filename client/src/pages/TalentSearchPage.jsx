import { useState } from 'react'
import { Link } from 'react-router-dom'

const results = [
  { name: 'Chethina Sri', role: 'Java Developer', skills: '95% Java · 88% SQL' },
  { name: 'Raveen Caldera', role: 'DevOps Engineer', skills: '91% Docker · 84% CI/CD' },
  { name: 'Amara Perera', role: 'Frontend Engineer', skills: '93% React · 87% CSS' },
]

export default function TalentSearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar dark />

      <section className="bg-[#0f172a] pb-16 pt-14 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Hire on proven skill, not resumes</h1>
        <p className="text-slate-400 mt-4">Search thousands of candidates by verified assessment scores.</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by skill, role, or score threshold..."
          className="mt-8 w-full max-w-xl mx-auto block px-5 py-3.5 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </section>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
            <p className="text-xs font-semibold text-gray-500 mb-3">FILTER BY</p>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Java, Python, SQL...</p>
              <p>Score above 80%</p>
              <p>Available for hire</p>
            </div>
          </aside>

          <div className="space-y-4">
            {results.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold text-gray-900">{r.name} — {r.role}</h3>
                <p className="text-xs text-gray-500 mt-1">{r.skills}</p>
              </div>
            ))}
          </div>
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