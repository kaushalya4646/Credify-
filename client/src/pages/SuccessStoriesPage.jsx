import { Link } from 'react-router-dom'

const stories = [
  {
    initials: 'CS',
    name: 'Chethina Sri',
    role: 'Java Developer @ Acme Corp',
    quote: '"Verifying my Java score got me straight to final interview — no screening calls needed."',
    score: '95%',
  },
  {
    initials: 'RC',
    name: 'Raveen Caldera',
    role: 'DevOps Engineer @ Nimbus',
    quote: '"The skill-gap report told me exactly what to study before my next application."',
    score: '88%',
  },
  {
    initials: 'AP',
    name: 'Amara Perera',
    role: 'Frontend Engineer @ Loop',
    quote: '"Recruiters reached out to me directly after my profile went live. Took two weeks."',
    score: '91%',
  },
]

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Real people, real outcomes</h1>
          <p className="text-gray-500 mt-3">See how candidates used verified skills to land their next role.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-4">
                {s.initials}
              </div>
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{s.role}</p>
              <p className="text-sm text-gray-600 mb-6">{s.quote}</p>
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                {s.score}
              </span>
            </div>
          ))}
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