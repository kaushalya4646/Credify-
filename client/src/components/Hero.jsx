import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 text-center md:py-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 md:text-6xl">
          Verify your skills. Build your career
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
          Demonstrate your technical skills through practical assessments
          and build a verified professional profile.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/register" className="w-full rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white hover:bg-primary-dark sm:w-auto">
            Get Started →
          </Link>
          <Link to="/register" className="w-full rounded-lg border-2 border-primary px-8 py-3 text-lg font-semibold text-primary hover:bg-blue-50 sm:w-auto">
            For Recruiters
          </Link>
        </div>
      </div>
    </section>
  )
}