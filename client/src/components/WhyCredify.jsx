function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-green-500">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

const features = [
  {
    tag: 'Verification',
    title: 'Verified Skills',
    text: 'Bypass initial interviews entirely. Prove your algorithmic logic, framework expertise, and system architecture skills with audited benchmarks.',
    widget: (
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900">React Frontend Architecture</span>
          <span className="text-xs font-semibold text-green-600">Verified Expert</span>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-1.5 w-1/4 rounded-full bg-green-500" />
          <div className="h-1.5 w-1/4 rounded-full bg-green-500" />
          <div className="h-1.5 w-[12%] rounded-full bg-green-500" />
        </div>
      </div>
    ),
    points: [
      'Industry-stamped crypto-credentials',
      'Shareable public profile with deep-dive telemetry',
      'Proven to reduce hire-cycle time by 14 days',
    ],
  },
  {
    tag: 'Development',
    title: 'Skill Gap Analysis',
    text: 'Understand exactly where your portfolio stands against your dream IT roles. Our AI breaks down what you lack and provides roadmap guidance.',
    widget: (
      <div>
        <p className="text-xs font-medium text-slate-700">Required for Lead Backend roles:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
            System Design (Acquired)
          </span>
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-medium text-orange-700">
            Redis Cache (1 Gap Identified)
          </span>
        </div>
      </div>
    ),
    points: [
      'Custom visual gap map report',
      'Targeted resources aligned with industry requirements',
      'Continuous tracking as you complete challenges',
    ],
  },
  {
    tag: 'Acceleration',
    title: 'Career Guidance',
    text: 'Gain access to verified mentors, career acceleration roadmaps, resume feedback circles, and custom negotiation coaching.',
    widget: (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100" />
        <div className="text-xs">
          <p className="font-semibold text-slate-900">Career Advisor AI</p>
          <p className="text-slate-600">
            &ldquo;Based on your AWS validation, target DevOps roles...&rdquo;
          </p>
        </div>
      </div>
    ),
    points: [
      'Mock whiteboard interview prep cycles',
      'Personalized resume auditing by staff engineers',
      'Strategic negotiation advice frameworks',
    ],
  },
  {
    tag: 'Placement',
    title: 'Recruiter Matching',
    text: 'Never apply blindly again. Get matched straight to IT managers looking for your specific validated skill parameters.',
    widget: (
      <div className="text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">Direct Match: Stripe Inc.</span>
          <span className="font-semibold text-green-600">98% Match</span>
        </div>
        <p className="mt-1 text-slate-600">
          Your verified Kotlin credentials matched a priority open mandate.
        </p>
      </div>
    ),
    points: [
      'Zero cold messaging pipelines',
      'Direct connection to high-growth tech firms',
      'Exclusive access to unlisted partner roles',
    ],
  },
]

export default function WhyCredify() {
  return (
    <section id="why-credify" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why industry leaders choose us
          </p>
          <h2 className="mt-3 text-3xl font-bold uppercase text-slate-900 md:text-4xl">
            Why Credify?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <article key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-block rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                {f.tag}
              </span>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">{f.widget}</div>

              <ul className="mt-5 space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}