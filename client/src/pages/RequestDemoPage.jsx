import { useState } from 'react'
import { Link } from 'react-router-dom'

const highlights = [
  'Live candidate search & filtering',
  'Bulk credential verification',
  'Audit trail & compliance reports',
  'ATS integration options',
  'Pricing for your team size',
]

export default function RequestDemoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">See Credify in action</h1>
            <p className="text-gray-500 mb-8">
              Book a 30-minute walkthrough with our team to see how enterprise auditing, talent search, and verification work.
            </p>

            {submitted ? (
              <div className="py-10 text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Request received</h2>
                <p className="text-gray-500 text-sm">Our team will reach out to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">FULL NAME</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">WORK EMAIL</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">COMPANY</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">TEAM SIZE</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>200+</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark">
                  Request demo
                </button>
              </form>
            )}
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-lg mb-6">What you'll see</h2>
            <ul className="space-y-4">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
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