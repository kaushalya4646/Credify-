import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ContactPage() {
  const [role, setRole] = useState('candidate')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Get in touch</h1>
          <p className="text-gray-500 mt-3">
            Questions about Credify for your team, or as a candidate? We'd love to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            {submitted ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Message sent</h2>
                <p className="text-gray-500">We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a...</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('candidate')}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border ${
                        role === 'candidate'
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-slate-200 text-gray-600'
                      }`}
                    >
                      Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('employer')}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border ${
                        role === 'employer'
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-slate-200 text-gray-600'
                      }`}
                    >
                      Employer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-semibold text-gray-500 mb-1">EMAIL</p>
              <p className="text-sm font-semibold text-gray-900 mb-4">support@credify.com</p>
              <p className="text-xs font-semibold text-gray-500 mb-1">PHONE</p>
              <p className="text-sm font-semibold text-gray-900">+94 11 234 5678</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-semibold text-gray-500 mb-1">OFFICE</p>
              <p className="text-sm font-semibold text-gray-900 mb-4">Colombo, Sri Lanka</p>
              <p className="text-xs font-semibold text-gray-500 mb-1">HOURS</p>
              <p className="text-sm font-semibold text-gray-900">Mon–Fri, 9am–6pm</p>
            </div>
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
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link to="/talent-search">Talent Search</Link>
          <Link to="/verify-credentials">Verify Credentials</Link>
          <Link to="/success-stories">Success Stories</Link>
        </nav>
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