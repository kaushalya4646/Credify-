// RecruiterProfilePage.jsx
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

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default function RecruiterProfilePage() {
  const [openModal, setOpenModal] = useState(null); // 'profile' | 'recruiterInfo' | 'companyInfo' | null

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

  const [profile, setProfile] = useState({
    name: "M Perera",
    jobTitle: "IT Recruiter",
    company: "TechVision Solutions",
    location: "Colombo, Sri Lanka",
  });

  const [recruiterInfo, setRecruiterInfo] = useState({
    fullName: "M Perera",
    jobTitle: "IT Recruiter",
    company: "TechVision Solutions",
    email: "nethmi@techvision.lk",
    phone: "+94 71 2345678",
    location: "Colombo, Sri Lanka",
    experience: "5 years in technology recruitment",
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "TechVision Solutions",
    industry: "Information Technology",
    size: "25–100 employees",
    location: "Colombo, Sri Lanka",
    website: "www.techvision.lk",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruiterSidebar />
      <div className="ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Recruiter Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your recruiter identity and company details
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
                  {profile.name}
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

        <main className="p-10 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-primary">
                MP
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {profile.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    ✓ Verified Profile
                  </span>
                </div>
                <p className="text-slate-500">{profile.jobTitle}</p>
                <p className="text-sm text-slate-500">
                  {profile.company} · {profile.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpenModal("profile")}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Edit profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-slate-900">
                  Recruiter information
                </h3>
                <button
                  onClick={() => setOpenModal("recruiterInfo")}
                  className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold"
                >
                  Edit information
                </button>
              </div>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Full name</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Job title</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.company}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Work email</p>
                  <p className="font-semibold text-primary">
                    {recruiterInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Experience</p>
                  <p className="font-semibold text-slate-900">
                    {recruiterInfo.experience}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-slate-900">
                  Company information
                </h3>
                <button
                  onClick={() => setOpenModal("companyInfo")}
                  className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold"
                >
                  Edit information
                </button>
              </div>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company name</p>
                  <p className="font-semibold text-slate-900">
                    {companyInfo.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Industry</p>
                  <p className="font-semibold text-slate-900">
                    {companyInfo.industry}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Company size</p>
                  <p className="font-semibold text-slate-900">
                    {companyInfo.size}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="font-semibold text-slate-900">
                    {companyInfo.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Website</p>
                  <p className="font-semibold text-primary">
                    {companyInfo.website}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              ["8", "Active jobs"],
              ["25", "Saved candidates"],
              ["15", "Candidates contacted"],
              ["5", "Hires completed"],
            ].map(([num, label]) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-3xl font-bold text-slate-900">{num}</p>
                  <p className="text-sm text-slate-500 mt-1">{label}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                  ●
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Edit profile (basics) modal */}
      {openModal === "profile" && (
        <Modal title="Edit profile" onClose={() => setOpenModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpenModal(null);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job title
              </label>
              <input
                value={profile.jobTitle}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, jobTitle: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company
              </label>
              <input
                value={profile.company}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, company: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, location: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {/* Recruiter information modal */}
      {openModal === "recruiterInfo" && (
        <Modal
          title="Edit recruiter information"
          onClose={() => setOpenModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpenModal(null);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full name
                </label>
                <input
                  value={recruiterInfo.fullName}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({
                      ...r,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job title
                </label>
                <input
                  value={recruiterInfo.jobTitle}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({
                      ...r,
                      jobTitle: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company
                </label>
                <input
                  value={recruiterInfo.company}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({ ...r, company: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work email
                </label>
                <input
                  type="email"
                  value={recruiterInfo.email}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({ ...r, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone
                </label>
                <input
                  value={recruiterInfo.phone}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({ ...r, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  value={recruiterInfo.location}
                  onChange={(e) =>
                    setRecruiterInfo((r) => ({
                      ...r,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Experience
              </label>
              <input
                value={recruiterInfo.experience}
                onChange={(e) =>
                  setRecruiterInfo((r) => ({
                    ...r,
                    experience: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {/* Company information modal */}
      {openModal === "companyInfo" && (
        <Modal
          title="Edit company information"
          onClose={() => setOpenModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpenModal(null);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company name
                </label>
                <input
                  value={companyInfo.companyName}
                  onChange={(e) =>
                    setCompanyInfo((c) => ({
                      ...c,
                      companyName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Industry
                </label>
                <input
                  value={companyInfo.industry}
                  onChange={(e) =>
                    setCompanyInfo((c) => ({ ...c, industry: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company size
                </label>
                <input
                  value={companyInfo.size}
                  onChange={(e) =>
                    setCompanyInfo((c) => ({ ...c, size: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  value={companyInfo.location}
                  onChange={(e) =>
                    setCompanyInfo((c) => ({ ...c, location: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Website
              </label>
              <input
                value={companyInfo.website}
                onChange={(e) =>
                  setCompanyInfo((c) => ({ ...c, website: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}