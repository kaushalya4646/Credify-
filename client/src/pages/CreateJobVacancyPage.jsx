// CreateJobVacancyPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Find Candidates", path: "/recruiter/find-candidates" },
  { label: "Create Jobs", path: "/recruiter/jobs/create" },
  { label: "My Jobs", path: "/recruiter/jobs" },
  { label: "Saved Candidates", path: "/recruiter/saved-candidates" },
  { label: "My Profile", path: "/recruiter/profile" },
];

const notifications = [
  {
    title: "New application received",
    detail: "A candidate applied to Backend Engineer",
  },
  {
    title: "Candidate match found",
    detail: "Danee Smith matches 92% for Senior Frontend Engineer",
  },
  {
    title: "Job posting expiring soon",
    detail: "Frontend Engineer posting closes in 3 days",
  },
];

function RecruiterSidebar() {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-primary">Credify</span>
      </div>
      <p className="px-6 text-[11px] tracking-wide text-slate-500">
        RECRUITER WORKSPACE
      </p>
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          // Editing a job counts as being in My Jobs.
          const active =
            location.pathname === item.path ||
            (item.path === "/recruiter/jobs" && location.pathname.startsWith("/recruiter/jobs/edit/"));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                active
                  ? "text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Convenience suggestions only; these fields are free text.
const jobTitleOptions = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Data Analyst",
  "Product Manager",
];
const countryOptions = [
  "Sri Lanka",
  "India",
  "United States",
  "United Kingdom",
  "Australia",
  "Germany",
  "Singapore",
];
const cityOptions = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Negombo",
  "Bangalore",
  "London",
  "Singapore",
];
const experienceOptions = [
  "0 years",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "5+ years",
];
const degreeOptions = [
  "BSc in Software Engineering",
  "BSc in Computer Science",
  "BEng in IT",
  "BSc in Information Systems",
  "MSc in Computer Science",
];
const currencyOptions = ["LKR", "USD", "EUR", "GBP"];

const EMPTY_FORM = {
  title: "",
  description: "",
  employmentType: "full-time",
  country: "",
  city: "",
  experience: "",
  degree: "",
  university: "",
  currency: "LKR",
  salaryLow: 50000,
  salaryHigh: 150000,
  deadline: "",
};

// ISO date -> "YYYY-MM-DD" in local time, for <input type="date">.
function toDateInput(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// "YYYY-MM-DD" -> the end of that day (local time), so "today" is still a valid deadline.
function fromDateInput(value) {
  return value ? new Date(`${value}T23:59:59`).toISOString() : null;
}

export default function CreateJobVacancyPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [skills, setSkills] = useState([]); // { skillId, name, level }
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");
  const [activeSkills, setActiveSkills] = useState([]);
  const [jobStatus, setJobStatus] = useState(null); // edit mode: the job's current status
  const [originalDeadline, setOriginalDeadline] = useState("");
  const [loadState, setLoadState] = useState(isEdit ? "loading" : "ready"); // loading | ready | error
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(null); // "draft" | "publish" | "save" | null

  // which header dropdown is open: 'help' | 'notifications' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  // Skills a job can use: Active ones only (non-admins only get Active skills).
  useEffect(() => {
    api
      .get("/api/skills")
      .then((list) =>
        setActiveSkills(
          (list || []).filter((s) => s.status === "Active").sort((a, b) => a.name.localeCompare(b.name)),
        ),
      )
      .catch((err) => console.error("Failed to load skills:", err));
  }, []);

  // Edit mode: load the job and prefill everything.
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoadState("loading");
    api
      .get(`/api/jobs/${id}`)
      .then((job) => {
        if (cancelled) return;
        if (user && job.recruiterId !== user.id) {
          setLoadError("You can only edit your own job postings.");
          setLoadState("error");
          return;
        }
        const deadline = toDateInput(job.deadline);
        setForm({
          title: job.title,
          description: job.description,
          employmentType: job.employmentType,
          country: job.country,
          city: job.city,
          experience: job.experienceRequired ?? "",
          degree: job.degree ?? "",
          university: job.university ?? "",
          currency: job.currency,
          salaryLow: job.salaryLow,
          salaryHigh: job.salaryHigh,
          deadline,
        });
        setOriginalDeadline(deadline);
        setSkills(job.skills.map((s) => ({ skillId: s.skillId, name: s.name, level: s.level })));
        setJobStatus(job.status);
        setLoadState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message || "Could not load this job.");
        setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, user]);

  const SALARY_MIN = 0;
  const SALARY_MAX = 500000;
  const SALARY_STEP = 5000;

  function updateField(field, value) {
    setSubmitError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Only real Active skills can be added (matched by name, ignoring case).
  function addSkill() {
    const name = skillInput.trim();
    if (!name) return;
    const match = activeSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!match) {
      setSkillError(`"${name}" isn't an available skill. Choose one from the suggestions.`);
      return;
    }
    if (skills.some((s) => s.skillId === match.id)) {
      setSkillError(`${match.name} is already on this job.`);
      return;
    }
    setSkills((prev) => [...prev, { skillId: match.id, name: match.name, level: "optional" }]);
    setSkillInput("");
    setSkillError("");
  }

  function removeSkill(index) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function setSkillLevel(index, level) {
    setSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, level } : s)),
    );
  }

  function handleSalaryLowChange(value) {
    const num = Math.min(Number(value), form.salaryHigh - SALARY_STEP);
    updateField("salaryLow", num);
  }

  function handleSalaryHighChange(value) {
    const num = Math.max(Number(value), form.salaryLow + SALARY_STEP);
    updateField("salaryHigh", num);
  }

  function buildBody() {
    const body = {
      title: form.title,
      description: form.description,
      employmentType: form.employmentType,
      country: form.country,
      city: form.city,
      experienceRequired: form.experience.trim() || null,
      degree: form.degree.trim() || null,
      university: form.university.trim() || null,
      currency: form.currency,
      salaryLow: form.salaryLow,
      salaryHigh: form.salaryHigh,
      skills: skills.map(({ skillId, level }) => ({ skillId, level })),
    };
    // When editing, an untouched deadline isn't re-sent, so a job whose
    // deadline has passed can still have its other details corrected.
    if (!isEdit || form.deadline !== originalDeadline) {
      body.deadline = fromDateInput(form.deadline);
    }
    return body;
  }

  // action: "draft" (Save draft), "publish" (Publish job), "save" (edit an Active job)
  async function submit(action) {
    setSubmitError("");
    setSubmitting(action);
    let saved = false;
    try {
      if (!isEdit) {
        await api.post("/api/jobs", { ...buildBody(), status: action === "publish" ? "Active" : "Draft" });
      } else {
        await api.put(`/api/jobs/${id}`, buildBody());
        saved = true;
        if (action === "publish") await api.post(`/api/jobs/${id}/publish`);
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      const message = err.message || "Could not save the job.";
      setSubmitError(saved ? `Your changes were saved, but the job couldn't be published: ${message}` : message);
    } finally {
      setSubmitting(null);
    }
  }

  const lowPct =
    ((form.salaryLow - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;
  const highPct =
    ((form.salaryHigh - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEdit ? "Edit Job Vacancy" : "Create Job Vacancy"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isEdit ? "Update the details of this position" : "Define the requirements for your new position"}
            </p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            {/* Help dropdown */}
            <div className="relative">
              <button
                aria-label="Help"
                onClick={() => toggleMenu("help")}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                </svg>
              </button>
              {openMenu === "help" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/help-center"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Visit help center
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    to="/terms-of-service"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Terms of service
                  </Link>
                  <Link
                    to="/about-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    About us
                  </Link>
                  <Link
                    to="/feedback"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Give feedback about Credify
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications dropdown */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => toggleMenu("notifications")}
                className="relative text-gray-400 hover:text-gray-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
                </svg>
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              {openMenu === "notifications" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-900">
                    Notifications
                  </p>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <a
                        key={n.title}
                        href="#"
                        className="block border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        <span className="block font-medium text-gray-900">
                          {n.title}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {n.detail}
                        </span>
                      </a>
                    ))}
                  </div>
                  <Link
                    to="#"
                    className="block border-t border-gray-100 px-4 py-2 text-center text-sm font-semibold text-primary hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("profile")}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                  MP
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  M Perera
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openMenu === "profile" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/recruiter/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        {loadState !== "ready" ? (
          <main className="p-10">
            {loadState === "loading" ? (
              <p className="py-10 text-center text-sm text-slate-500">Loading job…</p>
            ) : (
              <div className="py-10 text-center space-y-3">
                <p className="text-sm text-red-600">{loadError}</p>
                <Link to="/recruiter/jobs" className="text-sm font-semibold text-primary hover:underline">Back to My Jobs</Link>
              </div>
            )}
          </main>
        ) : (
        <main className="p-10 grid grid-cols-3 gap-6">
          {submitError && (
            <div role="alert" className="col-span-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          {isEdit && jobStatus === "Closed" && (
            <div className="col-span-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
              This job is closed, so it can no longer be edited.
            </div>
          )}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6"
          >
            <h2 className="font-medium text-slate-900">Job information</h2>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Job title
              </label>
              <input
                list="job-title-options"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Backend Developer"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
              />
              <datalist id="job-title-options">
                {jobTitleOptions.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Job description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the role, responsibilities and team…"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Employment type
              </label>
              <div className="flex gap-3">
                {["full-time", "part-time"].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => updateField("employmentType", type)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      form.employmentType === type
                        ? "bg-blue-50 border-primary text-primary"
                        : "bg-white border-slate-300 text-slate-700"
                    }`}
                  >
                    {type === "full-time" ? "Full-time" : "Part-time"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Location
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    list="country-options"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Country"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                  />
                  <datalist id="country-options">
                    {countryOptions.map((o) => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <input
                    list="city-options"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                  />
                  <datalist id="city-options">
                    {cityOptions.map((o) => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Experience in years
              </label>
              <input
                list="experience-options"
                value={form.experience}
                onChange={(e) => updateField("experience", e.target.value)}
                placeholder="2 years"
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-sm"
              />
              <datalist id="experience-options">
                {experienceOptions.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Education
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    list="degree-options"
                    value={form.degree}
                    onChange={(e) => updateField("degree", e.target.value)}
                    placeholder="Degree programme"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                  />
                  <datalist id="degree-options">
                    {degreeOptions.map((o) => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </div>
                <input
                  value={form.university}
                  onChange={(e) => updateField("university", e.target.value)}
                  placeholder="University"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </form>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-medium text-slate-900 mb-4">
                Required skills
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  list="skill-options"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setSkillError("");
                  }}
                  aria-label="Add skill"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add technical skill…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <datalist id="skill-options">
                  {activeSkills.map((o) => (
                    <option key={o.id} value={o.name} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
                >
                  Add
                </button>
              </div>
              {skillError && (
                <p role="alert" className="-mt-2 mb-4 text-xs text-red-600">{skillError}</p>
              )}
              {skills.length === 0 && (
                <p className="text-sm text-slate-400">No skills added yet.</p>
              )}
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div
                    key={skill.skillId}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <button
                        type="button"
                        onClick={() => removeSkill(i)}
                        aria-label={`Remove ${skill.name}`}
                        className="text-slate-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                      {skill.name}
                    </span>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200">
                      {["required", "preferred", "optional"].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setSkillLevel(i, level)}
                          className={`px-3 py-1.5 text-xs font-semibold capitalize ${
                            skill.level === level
                              ? level === "required"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-primary"
                              : "bg-slate-100 text-slate-600"
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Salary range
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 mb-3">
                  <span>
                    {form.currency} {form.salaryLow.toLocaleString()}
                  </span>
                  <span>
                    {form.currency} {form.salaryHigh.toLocaleString()}
                  </span>
                </div>

                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-1.5 rounded-full bg-slate-200" />
                  <div
                    className="absolute h-1.5 rounded-full bg-primary"
                    style={{
                      left: `${lowPct}%`,
                      width: `${highPct - lowPct}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={SALARY_MIN}
                    max={SALARY_MAX}
                    step={SALARY_STEP}
                    value={form.salaryLow}
                    onChange={(e) => handleSalaryLowChange(e.target.value)}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  />
                  <input
                    type="range"
                    min={SALARY_MIN}
                    max={SALARY_MAX}
                    step={SALARY_STEP}
                    value={form.salaryHigh}
                    onChange={(e) => handleSalaryHighChange(e.target.value)}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Application deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            {isEdit && jobStatus === "Closed" ? null : isEdit && jobStatus === "Active" ? (
              <button
                type="button"
                onClick={() => submit("save")}
                disabled={submitting !== null}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting === "save" ? "Saving…" : "Save changes"}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => submit("draft")}
                  disabled={submitting !== null}
                  className="flex-1 py-3 rounded-xl border border-primary text-primary font-semibold text-sm disabled:opacity-60"
                >
                  {submitting === "draft" ? "Saving…" : "Save draft"}
                </button>
                <button
                  type="button"
                  onClick={() => submit("publish")}
                  disabled={submitting !== null}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-60"
                >
                  {submitting === "publish" ? "Publishing…" : "Publish job"}
                </button>
              </div>
            )}
          </div>
        </main>
        )}
      </div>
    </div>
  );
}