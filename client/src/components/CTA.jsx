import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="bg-primary px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to verify your true potential?
        </h2>
        <p className="mt-4 text-blue-100">
          Join thousands of software engineers, system admins, and product
          leaders who let their actual technical work do the talking. Get
          certified on Credify today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-white px-6 font-semibold text-primary hover:bg-blue-50 sm:w-auto"
          >
            Get Started For Free
          </Link>
          <Link to="/talk-to-sales"
            className="flex min-h-12 w-full items-center justify-center rounded-lg border border-white px-6 font-semibold text-white hover:bg-white/10 sm:w-auto"
          >
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  )
}