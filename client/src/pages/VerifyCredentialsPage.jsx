import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function VerifyCredentialsPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)

  const handleVerify = () => {
    if (!query.trim()) return
    setResult({
      name: 'Chethina Sri',
      skill: 'Java Programming',
      score: '95%',
      verifiedOn: '09/04/2026',
      issuer: 'Credify',
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Verify a credential</h1>
          <p className="text-gray-500 mt-3">
            Enter a candidate's verification ID or public profile link to confirm authenticity.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. CRD-2026-88213 or profile URL"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleVerify}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark"
          >
            Verify
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Credential verified</h2>
                <p className="text-xs text-gray-500">{result.name} · {result.skill}</p>
              </div>
            </div>
            <hr className="border-slate-100 mb-6" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">SCORE</p>
                <p className="font-semibold text-gray-900">{result.score}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">VERIFIED ON</p>
                <p className="font-semibold text-gray-900">{result.verifiedOn}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">ISSUED BY</p>
                <p className="font-semibold text-gray-900">{result.issuer}</p>
              </div>
            </div>
          </div>
        )}
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