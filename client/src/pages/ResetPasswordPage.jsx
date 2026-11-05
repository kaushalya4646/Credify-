import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') // TODO: validate this token against the backend

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    setError('')
    // TODO: POST /api/auth/reset-password with { token, password }
    navigate('/login')
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

        <h1 className="text-xl font-semibold text-slate-900 text-center mb-2">Set a new password</h1>
        <p className="text-sm text-slate-500 text-center mb-8">
          Choose a strong password you haven't used before.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Confirm new password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  )
}