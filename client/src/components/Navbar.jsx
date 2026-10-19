import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Candidates', href: '#CandidateDashboardPage' },
  { label: 'For Recruiters', href: '#why-credify' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#home" className="text-2xl font-bold text-primary">Credify</a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="font-semibold text-slate-900 hover:text-primary">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-primary hover:bg-slate-50">
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark">
            Register
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl md:hidden"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="space-y-1 border-t border-slate-200 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
               className="block rounded-lg px-3 py-3 hover:bg-slate-100">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 rounded-lg border border-primary px-4 py-3 text-center font-medium text-primary">Login</Link>
            <Link to="/register" className="flex-1 rounded-lg bg-primary px-4 py-3 text-center font-medium text-white">Register</Link>
          </div>
        </div>
      )}
    </header>
  )
}