import { Fragment } from 'react'

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      {children}
    </svg>
  )
}

const shield = <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />

const steps = [
  {
    title: 'Create Profile',
    text: 'Import GitHub, list stacks, and outline your targeted developer tracks.',
    icon: (
      <Icon>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </Icon>
    ),
  },
  {
    title: 'Take Assessment',
    text: 'Complete interactive, realistic environment-based technical coding tests.',
    icon: (
      <Icon>
        <path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </Icon>
    ),
  },
  {
    title: 'Verify Skills',
    text: 'Our peer-review & AI logic stamps your profile with tamper-proof verification badges.',
    icon: <Icon>{shield}</Icon>,
  },
  {
    title: 'Get Career Ready',
    text: 'Instantly unlocked in premium talent pipelines tailored precisely to your certified strengths.',
    icon: <Icon>{shield}</Icon>,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Streamlined success path
        </p>
        <h2 className="mt-3 text-3xl font-bold uppercase text-slate-900 md:text-4xl">
          How Credify Works
        </h2>

        <div className="mt-14 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          {steps.map((s, i) => (
            <Fragment key={s.title}>
              <div className="flex max-w-[16rem] flex-1 flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-white text-primary">
                  {s.icon}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase text-primary">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="rotate-90 text-3xl text-slate-400 md:mt-3 md:rotate-0">→</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}