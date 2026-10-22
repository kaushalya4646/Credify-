import { useState } from 'react'
import { Link } from 'react-router-dom'

const emailPattern = /^\S+@\S+\.\S+$/

// Sample data for the preview card on the left. Change it here.
const previewSkills = [
  { name: 'Java', score: 80 },
  { name: 'Spring Boot', score: 90 },
  { name: 'SQL', score: 75 },
]

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((f) => ({ ...f, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}

    if (!form.email.trim()) next.email = 'Email address is required.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    // TODO (backend step): send { email, password, remember } to the login API.
    // The server checks the credentials, asks for the 2FA code, and returns the user's role.
    // Then redirect by role: candidate -> candidate dashboard, recruiter -> recruiter dashboard.
    // Admins can't log in here, they use /admin/login.
    console.log('Login:', { email: form.email.trim(), remember })
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Left branding panel, large screens only */}
      <aside className="hidden shrink-0 flex-col border-r border-gray-200 bg-white px-16 py-14 xl:sticky xl:top-0 xl:flex xl:h-screen xl:w-[44.44%] xl:self-start">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12.8 16.2l2.4 2.4 4-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[26px] font-bold leading-none tracking-tight text-primary">Credify</span>
        </Link>

        <div className="my-auto w-full max-w-[512px] py-10">
          <p className="text-[38px] font-bold leading-[46px] tracking-[-1px] text-gray-900">
            <span className="block">Your skills.</span>
            <span className="block">Your credibility.</span>
          </p>
          <p className="mt-4 max-w-md text-base leading-6 text-gray-500">
            Build a verified professional profile with industry-standard skill
            assessments that recruiters can trust.
          </p>

          <div className="mt-12 rounded-xl border border-gray-200 bg-white px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-base font-semibold text-primary">
                CS
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-gray-900">Chethina Sri</p>
                <p className="text-xs text-gray-500">Backend Developer</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#E8F5EE] py-1 pl-2 pr-3 text-[11px] font-semibold text-green-700">
                <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
                  <circle cx="6" cy="6" r="6" fill="#15803D" />
                  <path d="M3.2 6l2 2 3.4-3.6" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified Profile
              </span>
            </div>

            <ul className="mt-5 space-y-[18px] border-t border-gray-200 pt-6">
              {previewSkills.map((s) => (
                <li key={s.name}>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-900">{s.name}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5EE] py-0.5 pl-1.5 pr-2.5 text-[11px] font-semibold text-green-700">
                      <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
                        <circle cx="6" cy="6" r="6" fill="#15803D" />
                        <path d="M3.2 6l2 2 3.4-3.6" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Verified
                    </span>
                    <span className="ml-auto text-[13px] font-semibold text-gray-900">{s.score}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Right side: the form */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <Link to="/" className="mb-8 flex items-center gap-2.5 xl:hidden">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12.8 16.2l2.4 2.4 4-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[26px] font-bold leading-none tracking-tight text-primary">Credify</span>
        </Link>

        <div className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
          <h1 className="text-[28px] font-bold leading-9 tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to your Credify account.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-[13px] font-semibold leading-5 text-gray-900">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@yourmail.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`mt-1.5 block h-11 w-full rounded-lg border bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-semibold leading-5 text-gray-900">
                  Password
                </label>
                {/* TODO: link to the forgot-password page when it exists */}
                <a href="#" className="text-[13px] font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? 'true' : undefined}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`block h-11 w-full rounded-lg border bg-white px-4 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <svg viewBox="0 0 18 16" className="h-4 w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 8s3-5.5 8-5.5S17 8 17 8s-3 5.5-8 5.5S1 8 1 8z" />
                    <circle cx="9" cy="8" r="2.5" />
                    {showPassword && <path d="M2.5 14.5L15.5 1.5" />}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-[18px] w-[18px] cursor-pointer rounded-[5px] border-gray-300 accent-primary"
              />
              Remember me
            </label>

            <button
              type="submit"
              className="h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-white hover:bg-primary-dark"
            >
              Log in
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&rsquo;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
            <p className="mt-4 text-xs text-gray-400">Protected by Credify verification</p>
          </div>
        </div>
      </main>
    </div>
  )
}