export default function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200 bg-white px-4 py-8 text-center">
      <p className="text-xl font-bold text-primary">Credify</p>
      <p className="mt-2 text-slate-600">Industry Skill Verification and Career Readiness Platform</p>
      <p className="mt-4 text-sm text-slate-500">© {new Date().getFullYear()} Credify – Group 22. All rights reserved.</p>
    </footer>
  )
}