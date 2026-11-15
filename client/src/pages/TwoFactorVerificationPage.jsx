// src/pages/TwoFactorVerificationPage.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TwoFactorVerificationPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const navigate = useNavigate()

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: POST /api/auth/verify-2fa with { code: code.join('') }
    navigate('/candidate/dashboard')
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

        <h1 className="text-xl font-semibold text-slate-900 text-center mb-2">Verify it's you</h1>
        <p className="text-sm text-slate-500 text-center mb-1">Enter the 6-digit code we sent to</p>
        <p className="text-sm font-semibold text-slate-900 text-center mb-6">you***@example.com</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
                inputMode="numeric"
                className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-slate-300 focus:border-primary focus:outline-none"
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 text-right mb-6">Code expires in 04:52</p>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
          >
            Verify and continue
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Didn't get a code?{' '}
          <button className="text-primary font-medium">Resend code</button>
        </p>
      </div>
    </div>
  )
}