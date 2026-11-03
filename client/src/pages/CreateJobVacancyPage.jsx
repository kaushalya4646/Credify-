import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Find Candidates", path: "/recruiter/find-candidates" },
  { label: "Create Jobs", path: "/recruiter/jobs/create" },
  { label: "Saved Candidates", path: "/recruiter/saved-candidates" },
  { label: "My Profile", path: "/recruiter/profile" },
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
      <div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Here to help you grow
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Get help with your profile, skills and assessments.
        </p>
        <a
          href="#"
          className="text-xs font-medium text-primary mt-3 inline-block"
        >
          Visit help center ↗
        </a>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-primary">
          MP
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            M Perera
          </p>
          <p className="text-xs text-slate-500">Recruiter account</p>
        </div>
      </div>
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
        <header className="bg-white border-b border-slate-200 px-10 py-7">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create Job Vacancy
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define the requirements for your new position
          </p>
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
