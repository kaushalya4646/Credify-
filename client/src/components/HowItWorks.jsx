const steps = [
  { icon: '👤', title: 'Create Profile' },
  { icon: '📝', title: 'Take Assessment' },
  { icon: '✅', title: 'Verify Skills' },
  { icon: '🚀', title: 'Get Career Ready' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold uppercase text-slate-900">How Credify Works</h2>

        <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-center">
          {steps.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex w-40 flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-blue-50 text-4xl">
                  {s.icon}
                </div>
                <p className="font-semibold text-slate-800">{s.title}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="rotate-90 text-3xl text-slate-400 md:rotate-0">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}