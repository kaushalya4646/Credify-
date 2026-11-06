// src/pages/AdminSystemSettingsPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Users", path: "/admin/users" },
  { label: "Career Roles", path: "/admin/career-roles" },
  { label: "Skills", path: "/admin/skills" },
  { label: "Assessments", path: "/admin/assessments" },
  { label: "Reports", path: "/admin/reports" },
  { label: "System Settings", path: "/admin/settings" },
];

const notifications = [
  { title: "New recruiter signup", detail: "TechVision Solutions registered as a new recruiter" },
  { title: "Flagged assessment content", detail: "A candidate reported an issue with the SQL assessment" },
  { title: "Weekly platform report ready", detail: "Your usage and activity summary is ready to view" },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto w-60 bg-white border-r border-slate-200 flex flex-col">
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
        ADMIN WORKSPACE
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

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-5.5 rounded-full relative transition-colors ${on ? "bg-green-600" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${on ? "translate-x-4.5" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function AdminSystemSettingsPage() {
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [allowRecruiterRegistration, setAllowRecruiterRegistration] =
    useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [skillRecommendations, setSkillRecommendations] = useState(true);
  const [careerRecommendations, setCareerRecommendations] = useState(true);
  const [candidateMatching, setCandidateMatching] = useState(true);

  // header dropdown state: 'help' | 'notifications' | 'profile' | null
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

  function handleSave() {
    // TODO: PATCH /api/admin/settings with all the values below
    console.log("Save settings");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              System Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure platform behaviour, assessments, verification and
              security.
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
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                </svg>
              </button>
              {openMenu === "help" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/admin/help-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage help center</Link>
                  <Link to="/admin/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage privacy policy</Link>
                  <Link to="/admin/terms-of-service" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage terms of service</Link>
                  <Link to="/admin/about-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage about us</Link>
                  <Link to="/admin/feedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage feedback</Link>
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
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
                </svg>
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              {openMenu === "notifications" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-900">Notifications</p>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <a key={n.title} href="#" className="block border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50">
                        <span className="block font-medium text-gray-900">{n.title}</span>
                        <span className="block text-xs text-gray-500">{n.detail}</span>
                      </a>
                    ))}
                  </div>
                  <Link to="#" className="block border-t border-gray-100 px-4 py-2 text-center text-sm font-semibold text-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => toggleMenu("profile")} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                  AU
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">Admin User</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openMenu === "profile" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <div className="my-1 border-t border-gray-100" />
                  <Link to="/" className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">Log out</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">General settings</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Platform name
                </label>
                <input
                  defaultValue="Credify"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Platform description
                </label>
                <textarea
                  defaultValue="Industry skill verification and career readiness platform."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Default language
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="en-AU">English (Australia)</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">User management</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Allow new registration
                </span>
                <Toggle
                  on={allowRegistration}
                  onToggle={() => setAllowRegistration((v) => !v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Require email verification
                </span>
                <Toggle
                  on={requireEmailVerification}
                  onToggle={() => setRequireEmailVerification((v) => !v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Allow recruiter registration
                </span>
                <Toggle
                  on={allowRecruiterRegistration}
                  onToggle={() => setAllowRecruiterRegistration((v) => !v)}
                />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Quick metrics
                </h4>
                <p className="text-xs text-slate-400 italic">
                  Candidates vs recruiters chart renders here.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">
                Assessment settings
              </h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Maximum assessment duration
                </label>
                <div className="flex gap-2">
                  <input
                    defaultValue="180"
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                    <option>minutes</option>
                    <option>hours</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Maximum attempts
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Passing score
                </label>
                <div className="relative">
                  <input
                    defaultValue={50}
                    type="number"
                    min={0}
                    max={100}
                    className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    %
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Randomize questions
                </span>
                <Toggle
                  on={randomizeQuestions}
                  onToggle={() => setRandomizeQuestions((v) => !v)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">
                Verification settings
              </h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Verification expiry
                </label>
                <div className="flex gap-2">
                  <input
                    defaultValue="Never"
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                    <option>Days</option>
                    <option>Weeks</option>
                    <option>Months</option>
                    <option>Years</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Verification badges
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option>Allowed</option>
                  <option>Not allowed</option>
                  <option>Admin approval required</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Minimum score for verification
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option>30%</option>
                  <option>40%</option>
                  <option>50%</option>
                  <option>60%</option>
                  <option>70%</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Privacy & security</h3>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Recruiter access controls
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option>All candidates</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Session timeout
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>4 hours</option>
                  <option>24 hours</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Data retention
                </label>
                <div className="flex gap-2">
                  <input
                    defaultValue="Never"
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <select className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                    <option>Days</option>
                    <option>Weeks</option>
                    <option>Months</option>
                    <option>Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">Recommendations</h3>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Enable skill recommendations
                  </span>
                  <Toggle
                    on={skillRecommendations}
                    onToggle={() => setSkillRecommendations((v) => !v)}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Suggest skills to improve for a role.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Enable career recommendations
                  </span>
                  <Toggle
                    on={careerRecommendations}
                    onToggle={() => setCareerRecommendations((v) => !v)}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Suggest career roles that fit a profile.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Enable candidate matching
                  </span>
                  <Toggle
                    on={candidateMatching}
                    onToggle={() => setCandidateMatching((v) => !v)}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Match verified candidates to jobs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
            >
              Save changes
            </button>
            <button className="px-6 py-3 rounded-xl border border-primary text-primary font-semibold text-sm">
              Reset changes
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-semibold text-red-800 mb-1">⚠ Danger zone</h3>
            <p className="text-sm text-red-700 mb-4">
              These actions can affect the entire platform.
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">
                Disable platform
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">
                Reset system data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}