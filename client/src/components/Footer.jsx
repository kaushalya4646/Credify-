const columns = [
  { title: 'Platform', links: ['Assessments', 'Verify Credentials', 'Success Stories'] },
  { title: 'Employers', links: ['Talent Search', 'Enterprise Auditing', 'Request Demo'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Contact'] },
]

export default function Footer() {
  return (
    <footer id="about" className="bg-slate-900 px-4 pb-8 pt-14 text-slate-300">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <p className="text-xl font-bold text-white">Credify</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              We bridge the validation gap between exceptional software talent
              and premium tech employers around the globe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-14">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-400 hover:text-white">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-700 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Credify Technologies, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}