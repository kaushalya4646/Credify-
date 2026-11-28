// src/pages/MyJobsPage.jsx
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'Find Candidates', path: '/recruiter/find-candidates' },
  { label: 'Create Jobs', path: '/recruiter/jobs/create' },
  { label: 'My Jobs', path: '/recruiter/jobs' },
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
      <div className="px-6 pb-4">
        <LogoutLink className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50" />
      </div>
    </aside>
  )
}

// Same badge colours as the admin pages' Active / Draft / Inactive.
const statusStyles = {
  Active: 'bg-green-50 text-green-700',
  Draft: 'bg-amber-50 text-amber-700',
  Closed: 'bg-slate-100 text-slate-600',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatSalary(job) {
  return `${job.currency} ${job.salaryLow.toLocaleString()} – ${job.salaryHigh.toLocaleString()}`
}

export default function MyJobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [message, setMessage] = useState(null) // { kind: 'success' | 'error', text }
  const [busyId, setBusyId] = useState(null)
  const [confirming, setConfirming] = useState(null) // { id, action: 'delete' | 'close' }

  async function load() {
    try {
      setJobs((await api.get('/api/jobs/mine')) || [])
      setLoadError('')
    } catch (err) {
      setLoadError(err.message || 'Could not load your jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function runAction(job, action) {
    setBusyId(job.id)
    setMessage(null)
    setConfirming(null)
    try {
      if (action === 'delete') await api.delete(`/api/jobs/${job.id}`)
      else await api.post(`/api/jobs/${job.id}/${action}`)
      const done = { publish: 'published', close: 'closed', delete: 'deleted' }[action]
      setMessage({ kind: 'success', text: `"${job.title}" ${done}.` })
    } catch (err) {
      setMessage({ kind: 'error', text: err.message || 'Something went wrong.' })
    } finally {
      setBusyId(null)
      await load() // show the real state either way
    }
  }

  const now = new Date()
  const counts = {
    Active: jobs.filter((j) => j.status === 'Active').length,
    Draft: jobs.filter((j) => j.status === 'Draft').length,
    Closed: jobs.filter((j) => j.status === 'Closed').length,
    applicants: jobs.reduce((sum, j) => sum + j.applicationsCount, 0),
  }

  const actionBtn = 'px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50'

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Jobs</h1>
            <p className="text-sm text-slate-500 mt-1">Manage the job vacancies you've posted.</p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Create job
          </Link>
        </header>

        <main className="p-10 space-y-6">
          {loading && <p className="py-10 text-center text-sm text-slate-500">Loading your jobs…</p>}
          {!loading && loadError && <p className="py-10 text-center text-sm text-red-600">{loadError}</p>}

          {!loading && !loadError && (
            <>
              <div className="grid grid-cols-4 gap-6">
                {[
                  ['Active jobs', counts.Active],
                  ['Drafts', counts.Draft],
                  ['Closed', counts.Closed],
                  ['Total applicants', counts.applicants],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-sm text-slate-500 mb-2">{label}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              {message && (
                <div
                  role={message.kind === 'error' ? 'alert' : 'status'}
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.kind === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
                  <p className="text-sm text-slate-500">You haven't posted any jobs yet.</p>
                  <Link
                    to="/recruiter/jobs/create"
                    className="inline-block px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
                  >
                    Create Jobs
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 text-xs">
                        <th className="pb-2 font-semibold">Job title</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold">Applicants</th>
                        <th className="pb-2 font-semibold">Deadline</th>
                        <th className="pb-2 font-semibold">Salary range</th>
                        <th className="pb-2 font-semibold">Location</th>
                        <th className="pb-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => {
                        const expired = job.status === 'Active' && new Date(job.deadline) <= now
                        const busy = busyId === job.id
                        const isConfirming = confirming?.id === job.id
                        return (
                          <tr key={job.id} data-job-id={job.id} className="border-t border-slate-100 align-top">
                            <td className="py-3 pr-3 font-semibold text-slate-900">{job.title}</td>
                            <td className="py-3 pr-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[job.status] || statusStyles.Closed}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3 pr-3 text-slate-900">{job.applicationsCount}</td>
                            <td className={`py-3 pr-3 ${expired ? 'text-red-600' : 'text-slate-600'}`}>
                              {formatDate(job.deadline)}
                              {expired && <span className="block text-xs">Deadline passed</span>}
                            </td>
                            <td className="py-3 pr-3 text-slate-600">{formatSalary(job)}</td>
                            <td className="py-3 pr-3 text-slate-600">{job.city}, {job.country}</td>
                            <td className="py-3">
                              {isConfirming ? (
                                <div className="space-y-2">
                                  <p className="text-xs text-slate-700">
                                    {confirming.action === 'delete'
                                      ? 'Delete this draft? This can’t be undone.'
                                      : 'Close this job? It stops accepting applications and can’t be reopened.'}
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => runAction(job, confirming.action)}
                                      className={`${actionBtn} border-red-600 bg-red-600 text-white`}
                                    >
                                      {confirming.action === 'delete' ? 'Yes, delete' : 'Yes, close'}
                                    </button>
                                    <button onClick={() => setConfirming(null)} className={`${actionBtn} border-slate-300 text-slate-700`}>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : job.status === 'Closed' ? (
                                <span className="text-xs text-slate-400">No actions (closed)</span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                                    disabled={busy}
                                    className={`${actionBtn} border-slate-300 text-slate-700 hover:bg-slate-50`}
                                  >
                                    Edit
                                  </button>
                                  {job.status === 'Draft' && (
                                    <>
                                      <button
                                        onClick={() => runAction(job, 'publish')}
                                        disabled={busy}
                                        className={`${actionBtn} border-primary bg-primary text-white`}
                                      >
                                        Publish
                                      </button>
                                      <button
                                        onClick={() => setConfirming({ id: job.id, action: 'delete' })}
                                        disabled={busy}
                                        className={`${actionBtn} border-red-200 text-red-600 hover:bg-red-50`}
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                  {job.status === 'Active' && (
                                    <button
                                      onClick={() => setConfirming({ id: job.id, action: 'close' })}
                                      disabled={busy}
                                      className={`${actionBtn} border-red-200 text-red-600 hover:bg-red-50`}
                                    >
                                      Close
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
