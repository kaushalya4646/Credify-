// src/pages/SavedCandidatesPage.jsx
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

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// TODO (backend step): replace with the recruiter's real saved candidates from the API.
const savedCandidates = [
  {
    initials: "CS",
    name: "Chethina Sri",
    role: "Backend Developer",
    location: "Colombo",
    experience: "2 years experience",
    experienceYears: 2,
    match: 92,
    skills: ["Java", "SQL", "REST APIs"],
    score: 96,
    saved: "Aug 15, 2026",
    verified: true,
    email: "chethina.sri@example.com",
    phone: "+94 77 123 4567",
  },
  {
    initials: "MK",
    name: "M Kaushalya",
    role: "Software Engineer",
    location: "Kandy",
    experience: "3 years experience",
    experienceYears: 3,
    match: 86,
    skills: ["JavaScript", "MongoDB", "React"],
    score: 82,
    saved: "Sep 23, 2026",
    verified: true,
    email: "m.kaushalya@example.com",
    phone: "+94 71 234 5678",
  },
  {
    initials: "RK",
    name: "R Kushan",
    role: "Software Engineer",
    location: "Negombo",
    experience: "4 years experience",
    experienceYears: 4,
    match: 81,
    skills: ["Python", "SQL", "Git", "Django"],
    score: 79,
    saved: "Aug 03, 2026",
    verified: false,
    email: "r.kushan@example.com",
    phone: "+94 76 345 6789",
  },
];

const careerRoleOptions = [
  "All",
  ...new Set(savedCandidates.map((c) => c.role)),
];
const skillOptions = [
  "All",
  ...new Set(savedCandidates.flatMap((c) => c.skills)),
];
const matchOptions = [
  "All",
  "90% and above",
  "80%–89%",
  "70%–79%",
  "Below 70%",
];
const experienceOptions = [
  "All",
  "0–1 years",
  "2–3 years",
  "4–5 years",
  "5+ years",
];
const verificationOptions = ["All", "Verified", "Not verified"];
const dateSavedOptions = [
  "All",
  ...new Set(savedCandidates.map((c) => c.saved)),
];

const defaultFilters = {
  careerRole: "All",
  skill: "All",
  match: "All",
  experience: "All",
  verification: "All",
  dateSaved: "All",
};

function matchesFilters(c, filters) {
  if (filters.careerRole !== "All" && c.role !== filters.careerRole)
    return false;
  if (filters.skill !== "All" && !c.skills.includes(filters.skill))
    return false;
  if (filters.verification !== "All") {
    const wantsVerified = filters.verification === "Verified";
    if (c.verified !== wantsVerified) return false;
  }
  if (filters.dateSaved !== "All" && c.saved !== filters.dateSaved)
    return false;
  if (filters.match !== "All") {
    if (filters.match === "90% and above" && c.match < 90) return false;
    if (filters.match === "80%–89%" && (c.match < 80 || c.match > 89))
      return false;
    if (filters.match === "70%–79%" && (c.match < 70 || c.match > 79))
      return false;
    if (filters.match === "Below 70%" && c.match >= 70) return false;
  }
  if (filters.experience !== "All") {
    const y = c.experienceYears;
    if (filters.experience === "0–1 years" && !(y >= 0 && y <= 1)) return false;
    if (filters.experience === "2–3 years" && !(y >= 2 && y <= 3)) return false;
    if (filters.experience === "4–5 years" && !(y >= 4 && y <= 5)) return false;
    if (filters.experience === "5+ years" && !(y > 5)) return false;
  }
  return true;
}

export default function SavedCandidatesPage() {
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState("card");
  const [filters, setFilters] = useState(defaultFilters);
  const [contactCandidate, setContactCandidate] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  function openContact(candidate) {
    setNotificationSent(false);
    setContactCandidate(candidate);
  }

  const filtered = savedCandidates
    .filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((c) => matchesFilters(c, filters));

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Saved Candidates
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and manage candidates you have saved for potential
              recruitment.
            </p>
          </div>
          <Link
            to="/recruiter/find-candidates"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Find candidates
          </Link>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Saved Candidates</p>
              <p className="text-3xl font-bold text-slate-900">48</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                ↑ 12%
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">High Match</p>
              <p className="text-3xl font-bold text-slate-900">18</p>
              <p className="text-xs text-slate-500 mt-2">of 48 saved</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Recently Added</p>
              <p className="text-3xl font-bold text-slate-900">7</p>
              <p className="text-xs text-slate-500 mt-2">this week</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">Contacted</p>
              <p className="text-3xl font-bold text-slate-900">12</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                ↑ 9%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-5">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for candidates"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                <option>Recently saved</option>
                <option>Highest match</option>
                <option>Name A–Z</option>
              </select>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden">
                <button
                  onClick={() => setView("card")}
                  className={`px-4 py-2.5 text-sm font-semibold ${view === "card" ? "bg-blue-50 text-primary" : "text-slate-600"}`}
                >
                  Card view
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2.5 text-sm font-semibold ${view === "list" ? "bg-blue-50 text-primary" : "text-slate-600"}`}
                >
                  List view
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 border-t border-slate-100 pt-5">
              <div className="flex gap-3 flex-wrap">
                <select
                  value={filters.careerRole}
                  onChange={(e) => updateFilter("careerRole", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {careerRoleOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Career role" : o}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.skill}
                  onChange={(e) => updateFilter("skill", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {skillOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Skill" : o}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.match}
                  onChange={(e) => updateFilter("match", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {matchOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Match percentage" : o}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.experience}
                  onChange={(e) => updateFilter("experience", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {experienceOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Experience" : o}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.verification}
                  onChange={(e) => updateFilter("verification", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {verificationOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Verification status" : o}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.dateSaved}
                  onChange={(e) => updateFilter("dateSaved", e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
                >
                  {dateSavedOptions.map((o) => (
                    <option key={o} value={o}>
                      {o === "All" ? "Date saved" : o}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary"
              >
                Clear filters
              </button>
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-10">
                No saved candidates match these filters.
              </p>
            )}

            {view === "card" ? (
              <div className="grid grid-cols-3 gap-6">
                {filtered.map((c) => (
                  <div
                    key={c.name}
                    className="border border-slate-200 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-primary">
                        {c.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">
                      📍 {c.location}
                    </p>
                    <p className="text-sm text-slate-700 mb-3">
                      📅 {c.experience}
                    </p>
                    {c.verified && (
                      <span className="inline-block mb-3 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        ✓ Verified Profile
                      </span>
                    )}
                    <div className="border-t border-slate-100 pt-3 mb-3">
                      <p className="text-xs text-slate-500 mb-2">Top skills</p>
                      <div className="flex gap-2 flex-wrap">
                        {c.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1 border-t border-slate-100 pt-3">
                      <span className="text-slate-500">Assessment score</span>
                      <span className="font-bold text-slate-900">
                        {c.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Saved {c.saved}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openContact(c)}
                        className="flex-1 py-2 rounded-xl border border-primary text-primary text-sm font-semibold"
                      >
                        Contact
                      </button>
                      <button className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold">
                        Remove saved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {filtered.map((c) => (
                  <div key={c.name} className="flex items-center gap-4 p-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-primary">
                      {c.initials}
                    </div>
                    <div className="w-48 shrink-0">
                      <p className="font-semibold text-slate-900 text-sm">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500">{c.role}</p>
                    </div>
                    <p className="text-sm text-slate-600 w-28 shrink-0">
                      📍 {c.location}
                    </p>
                    <p className="text-sm text-slate-600 w-32 shrink-0">
                      {c.experience}
                    </p>
                    <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="text-center w-20 shrink-0">
                      <p className="font-bold text-slate-900 text-sm">
                        {c.score}%
                      </p>
                      <p className="text-[11px] text-slate-500">Score</p>
                    </div>
                    {c.verified && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        ✓ Verified
                      </span>
                    )}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => openContact(c)}
                        className="px-4 py-2 rounded-lg border border-primary text-primary text-xs font-semibold"
                      >
                        Contact
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Contact candidate modal */}
      {contactCandidate && (
        <Modal
          title={`Contact ${contactCandidate.name}`}
          onClose={() => setContactCandidate(null)}
        >
          <div className="space-y-3">
            <a
              href={`tel:${contactCandidate.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                📞
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Call</p>
                <p className="text-xs text-slate-500">
                  {contactCandidate.phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${contactCandidate.email}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                ✉️
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <p className="text-xs text-slate-500">
                  {contactCandidate.email}
                </p>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setNotificationSent(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-left"
            >
              <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                🔔
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Send platform notification
                </p>
                <p className="text-xs text-slate-500">
                  {notificationSent
                    ? "Notification sent ✓"
                    : `Notify ${contactCandidate.name} inside Credify`}
                </p>
              </div>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
