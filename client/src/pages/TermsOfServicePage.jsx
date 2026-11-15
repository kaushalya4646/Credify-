import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Acceptance of terms',
    body: 'By creating an account on Credify, you agree to these Terms of Service and our Privacy Policy.',
  },
  {
    title: '2. Assessment integrity',
    body: 'You agree not to cheat, share answers, or use unauthorized assistance during assessments. Violations may result in revoked credentials or account suspension.',
  },
  {
    title: '3. Employer obligations',
    body: 'Employers agree to use candidate data only for legitimate hiring purposes and not to redistribute verified credential data outside the platform.',
  },
  {
    title: '4. Account termination',
    body: 'Credify may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform.',
  },
  {
    title: '5. Limitation of liability',
    body: 'Credify is provided "as is" without warranties of any kind. We are not liable for hiring decisions made based on platform data.',
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-sm text-gray-500 mt-2 mb-10">Last updated: January 2026</p>

        <div className="grid lg:grid-cols-[1fr_260px] gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit sticky top-6">
            <p className="text-xs font-semibold text-gray-500 mb-3">ON THIS PAGE</p>
            <ul className="space-y-3 text-sm">
              {sections.map((s) => (
                <li key={s.title}>
                  <a href={`#${s.title}`} className="text-gray-600 hover:text-primary">{s.title}</a>
                </li>
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