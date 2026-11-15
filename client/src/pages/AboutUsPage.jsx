import { Link } from 'react-router-dom'

const stats = [
  { value: '12,000+', label: 'Verified candidates' },
  { value: '480+', label: 'Partner employers' },
  { value: '35+', label: 'Career role tracks' },
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <section className="bg-primary/10 py-20 text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">We bridge the validation gap</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Credify helps exceptional software talent prove their skills with evidence, not just claims.
        </p>
      </section>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To make verified skill, not pedigree, the currency of hiring.
          </p>
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