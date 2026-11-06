import { useState } from 'react'
import { Link } from 'react-router-dom'

const reasons = [
  'Dedicated account manager',
  'Custom pricing for your team size',
  'Priority support & onboarding',
  'ATS & API integration help',
]

export default function TalkToSalesPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Talk to our sales team</h1>
            <p className="text-gray-500 mb-8">
              Tell us about your hiring needs and we'll match you with the right plan and a dedicated account manager.
            </p>

            {submitted ? (
              <div className="py-10 text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Thanks — we got it</h2>
                <p className="text-gray-500 text-sm">A member of our sales team will reach out shortly.</p>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">WHAT ARE YOU HIRING FOR?</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark">
                  Talk to sales
                </button>
              </form>
            )}
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-lg mb-6">Why teams choose Credify</h2>
            <ul className="space-y-4 mb-10">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-sm italic">
              "Our response time to new sales inquiries is under 4 business hours."
            </p>
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