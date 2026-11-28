import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Assessments", to: "/candidate/assessments" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "Browse Jobs", to: "/candidate/jobs" },
  { label: "My Profile", to: "/candidate/profile" },
];

const LEVELS = [
  ["required", "Required", "bg-red-50 text-red-700"],
  ["preferred", "Preferred", "bg-blue-50 text-primary"],
  ["optional", "Optional", "bg-gray-100 text-gray-600"],
];

const EMPLOYMENT_LABELS = { "full-time": "Full-time", "part-time": "Part-time" };

// Best match first when the backend sent one; jobs without a match follow.
// Ties (and jobs without a match) go by soonest deadline.
function sortJobs(jobs) {
  return [...jobs].sort((a, b) => {
    const am = "match" in a, bm = "match" in b;
    if (am && bm && a.match !== b.match) return b.match - a.match;
    if (am !== bm) return am ? -1 : 1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function daysLeft(iso) {
  const days = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (days <= 0) return "Closes today";
  return days === 1 ? "1 day left" : `${days} days left`;
}

function JobCard({ job, onApplied }) {
  const [open, setOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const applied = job.hasApplied;

  async function apply() {
    setApplying(true);
    setError("");
    try {
      await api.post(`/api/jobs/${job.id}/apply`);
      onApplied(job.id);
    } catch (err) {
      // Already applied (e.g. from another tab): just show it as applied.
      if (/already applied/i.test(err.message || "")) onApplied(job.id);
      else setError(err.message || "Could not apply to this job.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <article data-job-id={job.id} className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType} · {job.city}, {job.country}
          </p>
        </div>
        {/* Only when the backend sends one: no dash or 0% otherwise. */}
        {"match" in job && (
          <div className="text-right" data-testid="match">
            <p className="text-2xl font-bold text-primary">{job.match}%</p>
            <p className="text-xs text-gray-500">Skills match</p>
          </div>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-gray-500">Salary</dt>
          <dd className="font-medium text-gray-900">
            {job.currency} {job.salaryLow.toLocaleString()} – {job.salaryHigh.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Deadline</dt>
          <dd className="font-medium text-gray-900">
            {formatDate(job.deadline)} <span className="text-xs font-normal text-gray-500">({daysLeft(job.deadline)})</span>
          </dd>
        </div>
        {job.experienceRequired && (
          <div>
            <dt className="text-xs text-gray-500">Experience</dt>
            <dd className="font-medium text-gray-900">{job.experienceRequired}</dd>
          </div>
        )}
      </dl>

      {job.skills.length > 0 && (
        <div className="mt-4 space-y-2">
          {LEVELS.map(([level, label, cls]) => {
            const list = job.skills.filter((s) => s.level === level);
            if (list.length === 0) return null;
            return (
              <div key={level} className="flex flex-wrap items-center gap-2">
                <span className="w-20 text-xs font-semibold text-gray-500">{label}</span>
                {list.map((s) => (
                  <span key={s.skillId} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
                    {s.name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-700">
          <p className="whitespace-pre-line">{job.description}</p>
          {(job.degree || job.university) && (
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Education: </span>
              {[job.degree, job.university].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {applied ? (
          <button
            type="button"
            disabled
            className="inline-flex min-h-10 items-center rounded-lg bg-green-50 px-5 text-sm font-semibold text-green-700"
          >
            ✓ Applied
          </button>
        ) : (
          <button
            type="button"
            onClick={apply}
            disabled={applying}
            className="inline-flex min-h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {applying ? "Applying…" : "Apply"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex min-h-10 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {open ? "Hide details" : "View details"}
        </button>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      </div>
    </article>
  );
}

export default function BrowseJobsPage() {
  const { pathname } = useLocation();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  // Refetch when the filters change (debounced while typing); ignore stale responses.
  useEffect(() => {
    const requestId = ++latestRequest.current;
    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (title.trim()) params.set("title", title.trim());
      if (location.trim()) params.set("location", location.trim());
      const qs = params.toString();
      try {
        const data = await api.get(`/api/jobs/browse${qs ? `?${qs}` : ""}`);
        if (requestId !== latestRequest.current) return;
        setJobs(data || []);
        setError("");
      } catch (err) {
        if (requestId !== latestRequest.current) return;
        setError(err.message || "Could not load jobs.");
      } finally {
        if (requestId === latestRequest.current) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [title, location]);

  function markApplied(jobId) {
    setJobs((list) => list.map((j) => (j.id === jobId ? { ...j, hasApplied: true } : j)));
  }

  const filtered = Boolean(title.trim() || location.trim());
  const sorted = sortJobs(jobs);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 px-2">
          <span className="text-xl font-bold tracking-tight text-primary">Credify</span>
        </Link>
        <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Candidate workspace
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                  active ? "text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <LogoutLink className="flex w-full min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-gray-50" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Browse Jobs</h1>
            <p className="text-sm text-gray-500">
              Open positions from recruiters, matched against your verified skills.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <input
              type="search"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search by job title"
              aria-label="Search by job title"
              className="min-h-11 flex-1 rounded-lg border border-gray-300 px-4 text-sm"
            />
            <input
              type="search"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or country"
              aria-label="City or country"
              className="min-h-11 w-full rounded-lg border border-gray-300 px-4 text-sm sm:w-64"
            />
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading jobs…</p>
          ) : error ? (
            <p className="py-10 text-center text-sm text-red-600">{error}</p>
          ) : sorted.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              {filtered ? (
                <>
                  <p className="text-base font-medium text-gray-900">No jobs match your search</p>
                  <p className="mt-1 text-sm text-gray-500">Try a different job title or location.</p>
                  <button
                    type="button"
                    onClick={() => { setTitle(""); setLocation(""); }}
                    className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-gray-900">No open jobs right now</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Recruiters haven't posted any open positions yet. Check back soon.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {sorted.length} open {sorted.length === 1 ? "job" : "jobs"}
              </p>
              <div className="space-y-4">
                {sorted.map((job) => (
                  <JobCard key={job.id} job={job} onApplied={markApplied} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
