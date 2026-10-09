const features = [
  'Verified Skills',
  'Skill Gap Analysis',
  'Career Guidance',
  'Recruiter Matching',
]

export default function WhyCredify() {
  return (
    <section id="why-credify" className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold uppercase text-slate-900">Why Credify?</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f} className="rounded-full border-2 border-slate-800 bg-white px-6 py-4 text-lg font-medium">
              ✓ {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}