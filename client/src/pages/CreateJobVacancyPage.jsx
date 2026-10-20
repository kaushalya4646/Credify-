import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'Find Candidates', path: '/recruiter/find-candidates' },
  { label: 'Create Jobs', path: '/recruiter/jobs/create' },
  { label: 'Saved Candidates', path: '/recruiter/saved-candidates' },
  { label: 'My Profile', path: '/recruiter/profile' },
]

function RecruiterSidebar() {
  const location = useLocation()
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-primary">Credify</span>
      </div>
      <p className="px-6 text-[11px] tracking-wide text-slate-500">RECRUITER WORKSPACE</p>
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                active ? 'bg-blue-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Here to help you grow</p>
        <p className="text-xs text-slate-500 mt-2">Get help with your profile, skills and assessments.</p>
        <a href="#" className="text-xs font-medium text-primary mt-3 inline-block">Visit help center ↗</a>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">MP</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">M Perera</p>
          <p className="text-xs text-slate-500">Recruiter account</p>
        </div>
      </div>
    </aside>
  )
}

export default function CreateJobVacancyPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    employmentType: 'full-time',
    country: '',
    city: '',
    experience: '',
    degree: '',
    university: '',
    salaryLow: '',
    salaryHigh: '',
    deadline: '',
  })
  const [skills, setSkills] = useState([
    { name: 'Java', level: 'required' },
    { name: 'Python', level: 'preferred' },
    { name: 'SQL', level: 'required' },
    { name: 'REST APIs', level: 'optional' },
  ])
  const [skillInput, setSkillInput] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addSkill() {
    if (!skillInput.trim()) return
    setSkills((prev) => [...prev, { name: skillInput.trim(), level: 'optional' }])
    setSkillInput('')
  }

  function setSkillLevel(index, level) {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, level } : s)))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: POST to /api/jobs with { ...form, skills }
    console.log('Create job vacancy payload:', { ...form, skills })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">Create Job Vacancy</h1>
          <p className="text-sm text-slate-500 mt-1">Define the requirements for your new position</p>
        </header>

        <main className="p-10 grid grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="font-medium text-slate-900">Job information</h2>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Job title</label>
              <input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Backend Developer"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Job description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the role, responsibilities and team…"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Employment type</label>
              <div className="flex gap-3">
                {['full-time', 'part-time'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => updateField('employmentType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      form.employmentType === type
                        ? 'bg-blue-50 border-primary text-primary'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    {type === 'full-time' ? 'Full-time' : 'Part-time'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Location</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="Country"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                />
                <input
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Experience in years</label>
              <input
                value={form.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                placeholder="2 years"
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Education</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={form.degree}
                  onChange={(e) => updateField('degree', e.target.value)}
                  placeholder="Degree programme"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                />
                <input
                  value={form.university}
                  onChange={(e) => updateField('university', e.target.value)}
                  placeholder="University"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </form>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-medium text-slate-900 mb-4">Required skills</h2>
              <div className="flex gap-2 mb-4">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add technical skill…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <button type="button" onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div key={skill.name + i} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{skill.name}</span>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200">
                      {['required', 'preferred', 'optional'].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setSkillLevel(i, level)}
                          className={`px-3 py-1.5 text-xs font-semibold capitalize ${
                            skill.level === level
                              ? level === 'required'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-blue-50 text-primary'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-medium text-slate-900">Additional details</h2>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Salary range</label>
                <div className="flex items-center gap-2">
                  <input
                    value={form.salaryLow}
                    onChange={(e) => updateField('salaryLow', e.target.value)}
                    placeholder="Low"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    value={form.salaryHigh}
                    onChange={(e) => updateField('salaryHigh', e.target.value)}
                    placeholder="High"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Application deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField('deadline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" className="flex-1 py-3 rounded-xl border border-primary text-primary font-semibold text-sm">
                Save draft
              </button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
                Publish job
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}