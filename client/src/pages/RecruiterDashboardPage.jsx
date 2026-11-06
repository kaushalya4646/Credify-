// RecruiterDashboardPage.jsx
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

const jobs = [
  { title: "Inventory Engineer", apps: 12, match: 70, status: "Available" },
  { title: "Backend Engineer", apps: 145, match: 88, status: "Available" },
  { title: "Frontend Engineer", apps: 26, match: 55, status: "Available" },
  { title: "Backend Management", apps: 19, match: 32, status: "Available" },
  { title: "Frontend Engineer", apps: 13, match: 22, status: "In process" },
];

export default function RecruiterDashboardPage() {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your recruitment activities and discover verified talent
            </p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            <Link
              to="/recruiter/jobs/create"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Create job
            </Link>

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

        <main className="p-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Overall recruiter status overview
            </h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Active jobs</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-xs text-green-700 font-semibold mt-2">
                  ↑ 14.2%
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Applications</p>
                <p className="text-3xl font-bold text-slate-900">145</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  ↑ 13.7%
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">
                  Recommended candidates
                </p>
                <p className="text-3xl font-bold text-slate-900">28</p>
                <p className="text-xs text-slate-500 mt-2">
                  Top roles: Senior Frontend, Backend
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-2">Saved candidates</p>
                <p className="text-3xl font-bold text-slate-900">35</p>
                <div className="h-1.5 rounded-full bg-slate-100 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">
                Recommended candidates
              </h3>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Danee Smith
                  </span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <p className="text-xs text-slate-500">
                  Senior Frontend Engineer
                </p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Kavindu Silva
                  </span>
                  <span className="font-bold text-slate-900">88%</span>
                </div>
                <p className="text-xs text-slate-500">Backend Engineer</p>
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">
                Active job vacancies
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs">
                    <th className="pb-2 font-semibold">Job title</th>
                    <th className="pb-2 font-semibold">Applications</th>
                    <th className="pb-2 font-semibold">Skills</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.title + job.status}
                      className="border-t border-slate-100"
                    >
                      <td className="py-3 font-semibold text-slate-900">
                        {job.title}
                      </td>
                      <td className="text-slate-600">{job.apps}</td>
                      <td>
                        <div className="h-1.5 w-24 rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-green-600"
                            style={{ width: `${job.match}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "Available"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
