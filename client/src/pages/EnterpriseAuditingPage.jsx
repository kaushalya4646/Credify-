import { Link } from 'react-router-dom'

const features = [
  {
    step: '1',
    title: 'Bulk verification',
    text: 'Upload a candidate list and verify hundreds of credentials in minutes.',
  },
  {
    step: '2',
    title: 'Audit trail & reports',
    text: 'Every verification is timestamped and exportable for compliance review.',
  },
  {
    step: '3',
    title: 'API integration',
    text: 'Plug Credify verification directly into your ATS or HR system.',
  },
]

export default function EnterpriseAuditingPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Auditing</h1>
          <p className="text-gray-500 mt-3">Verify every hire's credentials at scale, with a full audit trail.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((f) => (
            <div key={f.step} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center mb-4">
                {f.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{f.text}</p>
              <button className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20">
                Learn more
              </button>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-2xl py-8 px-6 text-center">
          <h2 className="text-white font-semibold text-lg mb-1">Ready to audit your hiring pipeline?</h2>
          <p className="text-blue-100 text-sm">Talk to our enterprise team today</p>
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