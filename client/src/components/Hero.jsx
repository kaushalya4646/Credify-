import { Link } from 'react-router-dom'

const stats = [
  { value: '24,000+', label: 'Verified IT Professionals' },
  { value: '320+', label: 'Partner Recruiters' },
  { value: '34%', label: 'Average Salary Boost' },
]

const skills = [
  { name: 'Algorithms & System Design', rank: 'Top 3%' },
  { name: 'System Architecture', rank: 'Top 3%' },
]

export default function Hero() {
  return (
    <section id="home" className="px-4 py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left side */}
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            🚀 Launching Credify 2.0 with AI Skill Matching
          </span>

          <h1 className="mt-6 text-4xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 md:text-5xl">
            Verify your skills.
            <br />
            Build your career
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Demonstrate your technical skills through practical assessments,
            bypass traditional screening, and build a verified professional
            profile that recruiters trust.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-white hover:bg-primary-dark"
            >
              Get Started <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/register"
              className="flex min-h-12 items-center justify-center rounded-lg border border-slate-200 px-6 font-medium text-primary hover:bg-slate-50"
            >
              For Recruiters
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: profile card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary" />
              <div>
                <p className="font-semibold text-slate-900">Alex Rivera</p>
                <p className="text-xs text-slate-600">Full-stack Developer</p>
              </div>
            </div>
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              Verified Elite
            </span>
          </div>

          <ul className="mt-5 space-y-3">
            {skills.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <span>{s.name}</span>
                <span className="text-primary">{s.rank}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}