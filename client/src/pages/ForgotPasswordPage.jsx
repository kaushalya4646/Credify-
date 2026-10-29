// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: POST /api/auth/forgot-password with { email }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
              <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-primary">Credify</span>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-xl font-semibold text-slate-900 text-center mb-2">Forgot your password?</h1>
            <p className="text-sm text-slate-500 text-center mb-8">
              Enter your email and we'll send you a link to reset it.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
              >
                Send reset link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500">
              If an account exists for <span className="font-medium text-slate-700">{email}</span>, we've sent a password reset link.
            </p>
          </div>
        )}

        <p className="text-sm text-center text-slate-500 mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-medium">Back to login</Link>
        </p>
      </div>
    </div>
  )
}