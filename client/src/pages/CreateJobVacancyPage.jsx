// CreateJobVacancyPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Find Candidates", path: "/recruiter/find-candidates" },
  { label: "Create Jobs", path: "/recruiter/jobs/create" },
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
          const active = location.pathname === item.path;
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

// TODO (backend step): replace these with real option lists from the API.
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
const skillSuggestions = [
  "Java",
  "Python",
  "SQL",
  "REST APIs",
  "React",
  "Node.js",
  "Docker",
  "AWS",
  "TypeScript",
  "MongoDB",
];
const currencyOptions = ["LKR", "USD", "EUR", "GBP"];

export default function CreateJobVacancyPage() {
  const [form, setForm] = useState({
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
  });
  const [skills, setSkills] = useState([
    { name: "Java", level: "required" },
    { name: "Python", level: "preferred" },
    { name: "SQL", level: "required" },
    { name: "REST APIs", level: "optional" },
  ]);
  const [skillInput, setSkillInput] = useState("");

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

  const SALARY_MIN = 0;
  const SALARY_MAX = 500000;
  const SALARY_STEP = 5000;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addSkill() {
    if (!skillInput.trim()) return;
    setSkills((prev) => [
      ...prev,
      { name: skillInput.trim(), level: "optional" },
    ]);
    setSkillInput("");
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

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST to /api/jobs with { ...form, skills }
    console.log("Create job vacancy payload:", { ...form, skills });
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
              Create Job Vacancy
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Define the requirements for your new position
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
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50"
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 grid grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
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
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add technical skill…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <datalist id="skill-options">
                  {skillSuggestions.map((o) => (
                    <option key={o} value={o} />
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
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div
                    key={skill.name + i}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-slate-900">
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

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-xl border border-primary text-primary font-semibold text-sm"
              >
                Save draft
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
              >
                Publish job
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}