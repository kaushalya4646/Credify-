import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

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
  {
    title: "New recruiter signup",
    detail: "TechVision Solutions registered as a new recruiter",
  },
  {
    title: "Flagged assessment content",
    detail: "A candidate reported an issue with the SQL assessment",
  },
  {
    title: "Weekly platform report ready",
    detail: "Your usage and activity summary is ready to view",
  },
];

const registrations = [
  {
    initials: "JC",
    name: "Jane Cooper",
    role: "Candidate",
    date: "04/09/2023",
    location: "Colombo",
  },
  {
    initials: "GH",
    name: "Guy Hawkins",
    role: "Recruiter",
    date: "05/09/2023",
    location: "Kandy",
  },
  {
    initials: "CE",
    name: "Campen Erame",
    role: "Candidate",
    date: "07/09/2023",
    location: "Galle",
  },
  {
    initials: "JS",
    name: "Jane Smith",
    role: "Recruiter",
    date: "09/09/2023",
    location: "Negombo",
  },
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

export default function AdminDashboardPage() {
  const [openMenu, setOpenMenu] = useState(null); // 'help' | 'notifications' | 'profile' | null
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
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome to the Credify central administration panel. Gain a quick
              overview of system performance and user activity.
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
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/admin/help-center"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage help center
                  </Link>
                  <Link
                    to="/admin/privacy-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage privacy policy
                  </Link>
                  <Link
                    to="/admin/terms-of-service"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage terms of service
                  </Link>
                  <Link
                    to="/admin/about-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage about us
                  </Link>
                  <Link
                    to="/admin/feedback"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manage feedback
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
                  AU
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  Admin User
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
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/admin/settings"
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Overall System Health
              </h2>
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                Verified
              </span>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">4,520</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  ↑ 10.23%
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Candidates</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">3,800</p>
                <p className="text-xs text-slate-500 mt-2">85% active</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Recruiters</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">720</p>
                <p className="text-xs text-slate-500 mt-2">
                  Total jobs posted: 720
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Assessments Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">4,520</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  ↑ 16.0%
                </span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">User Activity</h3>
              <p className="text-sm text-slate-500">
                New registrations and engagement trend charts render here
                (recharts/chart.js recommended).
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">
                Assessment Activity
              </h3>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-slate-900">82%</p>
                <p className="text-xs text-slate-500">Pass rate</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">
                Recent Registrations
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs">
                    <th className="pb-2 font-semibold">User</th>
                    <th className="pb-2 font-semibold">Role</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Location</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((u) => (
                    <tr key={u.name} className="border-t border-slate-100">
                      <td className="py-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-primary text-[10px] font-semibold flex items-center justify-center">
                          {u.initials}
                        </span>
                        {u.name}
                      </td>
                      <td className="text-slate-600">{u.role}</td>
                      <td className="text-slate-600">{u.date}</td>
                      <td className="text-slate-600">{u.location}</td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="font-medium text-slate-900">System Overview</h3>
              {[
                ["System uptime", "99.9%", 100],
                ["Active jobs", "10", 40],
                ["Active sessions", "128", 64],
              ].map(([label, val, pct]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{label}</span>
                    <span className="font-semibold text-slate-900">{val}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <Link
                to="/admin/users"
                className="bg-primary text-white rounded-xl py-3 text-center font-semibold hover:bg-primary-dark"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/skills"
                className="bg-primary text-white rounded-xl py-3 text-center font-semibold hover:bg-primary-dark"
              >
                Manage Skills
              </Link>
              <Link
                to="/admin/assessments"
                className="bg-primary text-white rounded-xl py-3 text-center font-semibold hover:bg-primary-dark"
              >
                Manage Assessments
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
