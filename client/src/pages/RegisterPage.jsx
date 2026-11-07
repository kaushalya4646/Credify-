import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const emailPattern = /^\S+@\S+\.\S+$/

// `role` is the account type stored by the system (the permission level).
// `label` is what the user sees and picks. Admin is never in this list.
const profileTypes = [
  { label: 'Student', role: 'candidate' },
  { label: 'Fresh graduate', role: 'candidate' },
  { label: 'Recruiter', role: 'recruiter' },
  { label: 'IT professional', role: 'candidate' },
  { label: 'Recruiter manager', role: 'recruiter' },
]

// Sample data for the preview card on the left. Change it here.
const previewSkills = [
  { name: 'Java', score: 80 },
  { name: 'Spring Boot', score: 90 },
  { name: 'SQL', score: 75 },
]

export default function RegisterPage() {
  const [params] = useSearchParams()
  // The landing page buttons open /register?role=candidate or /register?role=recruiter
  const [profileType, setProfileType] = useState(
    params.get('role') === 'recruiter' ? 'Recruiter' : 'Student',
  )
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((f) => ({ ...f, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}

    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email address is required.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (!form.confirm) next.confirm = 'Please confirm your password.'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    const { role } = profileTypes.find((p) => p.label === profileType)

    // TODO (backend step): send { fullName, email, password, role, profileType } to the register API.
    // The server must accept only "candidate" or "recruiter" for role, never "admin".
    console.log('Register:', {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role,
      profileType,
    })
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
          <h1 className="text-[28px] font-bold leading-9 tracking-tight text-gray-900">
            Create your Credify account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Start building your verified professional profile.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            {/* Full name */}
            <div>
              <label htmlFor="fullName" className="text-[13px] font-semibold leading-5 text-gray-900">
                Full name
              </label>
              <input
                id="fullName"
                autoComplete="name"
                placeholder="Chethina Sri"
                value={form.fullName}
                onChange={handleChange}
                aria-invalid={errors.fullName ? 'true' : undefined}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`mt-1.5 block h-11 w-full rounded-lg border bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-[13px] font-semibold leading-5 text-gray-900">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
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
              <label htmlFor="password" className="text-[13px] font-semibold leading-5 text-gray-900">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a password"
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

            {/* Confirm password */}
            <div>
              <label htmlFor="confirm" className="text-[13px] font-semibold leading-5 text-gray-900">
                Confirm password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  aria-invalid={errors.confirm ? 'true' : undefined}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                  className={`block h-11 w-full rounded-lg border bg-white px-4 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 ${
                    errors.confirm ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <svg viewBox="0 0 18 16" className="h-4 w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 8s3-5.5 8-5.5S17 8 17 8s-3 5.5-8 5.5S1 8 1 8z" />
                    <circle cx="9" cy="8" r="2.5" />
                    {showConfirm && <path d="M2.5 14.5L15.5 1.5" />}
                  </svg>
                </button>
              </div>
              {errors.confirm && (
                <p id="confirm-error" className="mt-1.5 text-xs text-red-600">{errors.confirm}</p>
              )}
            </div>

            {/* Profile type chips */}
            <div>
              <p id="profile-type-label" className="text-[13px] font-semibold leading-5 text-gray-900">
                I am a
              </p>
              <div role="radiogroup" aria-labelledby="profile-type-label" className="mt-2 flex flex-wrap gap-3">
                {profileTypes.map((p) => {
                  const selected = profileType === p.label
                  return (
                    <button
                      key={p.label}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setProfileType(p.label)}
                      className={`inline-flex min-h-12 items-center gap-1.5 rounded-full border px-4 text-[13px] sm:min-h-9 ${
                        selected
                          ? 'border-primary bg-primary font-semibold text-white'
                          : 'border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {selected && (
                        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 8.5l3 3 6-6.5" />
                        </svg>
                      )}
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-white hover:bg-primary-dark"
            >
              Create account
            </button>
          </form>

          {/* TODO: point these at the Terms and Privacy pages when they exist */}
          <p className="mt-5 text-center text-xs leading-[18px] text-gray-500">
            By creating an account, you agree to the{' '}
            <a href="#" className="font-semibold text-primary hover:underline">Terms of service</a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-primary hover:underline">Privacy policy</a>.
          </p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}