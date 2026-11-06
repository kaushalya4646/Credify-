// AdminFeedbackManagePage.jsx
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
  { title: "New recruiter signup pending review", detail: "TechVision Solutions awaits verification" },
  { title: "Content flagged for review", detail: "A candidate profile was flagged by the system" },
  { title: "Weekly platform report ready", detail: "View this week's growth and activity report" },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
      <Link to="/" className="flex items-center gap-2 px-2">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#2563EB" />
          <path d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12.8 16.2l2.4 2.4 4-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xl font-bold leading-none tracking-tight text-primary">Credify</span>
      </Link>
      <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        Admin workspace
      </p>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                active ? "text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

// TODO (backend step): replace with real feedback submissions from the FeedbackPage form, fetched from the API.
const initialFeedback = [
  {
    id: "fb-1",
    category: "Bug report",
    rating: 3,
    message: "The 'View all notifications' link doesn't go anywhere yet on the dashboard.",
    submittedBy: "chethina.sri@example.com",
    submittedAt: "2026-10-28",
    status: "new",
  },
  {
    id: "fb-2",
    category: "Feature request",
    rating: 4,
    message: "It would help to filter saved candidates by university, not just role and skill.",
    submittedBy: "nethmi@techvision.lk",
    submittedAt: "2026-10-25",
    status: "reviewed",
  },
  {
    id: "fb-3",
    category: "Assessment experience",
    rating: 2,
    message: "The timer for the Java assessment felt too short for 20 questions.",
    submittedBy: "m.kaushalya@example.com",
    submittedAt: "2026-10-20",
    status: "new",
  },
  {
    id: "fb-4",
    category: "General feedback",
    rating: 5,
    message: "Really like how clean the skill-gap analysis page is — very motivating.",
    submittedBy: "r.kushan@example.com",
    submittedAt: "2026-10-18",
    status: "reviewed",
  },
];

const categoryOptions = ["All", "General feedback", "Bug report", "Feature request", "Assessment experience", "Something else"];
const statusOptions = ["All", "New", "Reviewed"];

export default function AdminFeedbackManagePage() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeEntry, setActiveEntry] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  function toggleMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  function markReviewed(id) {
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, status: "reviewed" } : f)));
    setActiveEntry((e) => (e && e.id === id ? { ...e, status: "reviewed" } : e));
  }

  function removeEntry(id) {
    setFeedback((prev) => prev.filter((f) => f.id !== id));
    setActiveEntry(null);
  }

  const filtered = feedback.filter((f) => {
    if (categoryFilter !== "All" && f.category !== categoryFilter) return false;
    if (statusFilter !== "All" && f.status !== statusFilter.toLowerCase()) return false;
    if (searchText && !f.message.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const newCount = feedback.filter((f) => f.status === "new").length;

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Manage Feedback</h1>
            <p className="text-sm text-gray-500">Review feedback submitted by candidates and recruiters through the Feedback page.</p>
          </div>
          <div className="flex items-center gap-4" ref={menuRef}>
            <div className="relative">
              <button aria-label="Help" onClick={() => toggleMenu("help")} className="text-gray-400 hover:text-gray-600">
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
            <div className="relative">
              <button aria-label="Notifications" onClick={() => toggleMenu("notifications")} className="relative text-gray-400 hover:text-gray-600">
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
            <div className="relative">
              <button onClick={() => toggleMenu("profile")} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">AU</div>
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

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Total submissions</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{feedback.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Needs review</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">{newCount}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Average rating</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {(feedback.reduce((s, f) => s + f.rating, 0) / (feedback.length || 1)).toFixed(1)}/5
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search feedback messages…"
                className="min-w-[220px] flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "Category" : c}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "Status" : s}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-400">
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Message</th>
                    <th className="pb-2 font-medium">Rating</th>
                    <th className="pb-2 font-medium">Submitted</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f) => (
                    <tr key={f.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-primary">{f.category}</span>
                      </td>
                      <td className="max-w-xs py-3 pr-4 text-gray-700">
                        <button onClick={() => setActiveEntry(f)} className="line-clamp-1 text-left hover:underline">
                          {f.message}
                        </button>
                      </td>
                      <td className="py-3 text-gray-600">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</td>
                      <td className="py-3 text-gray-500">{f.submittedAt}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.status === "new" ? "bg-amber-50 text-amber-700" : "bg-[#E8F5EE] text-[#15803D]"}`}>
                          {f.status === "new" ? "New" : "Reviewed"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => setActiveEntry(f)} className="text-xs font-semibold text-primary hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-500">No feedback matches these filters.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {activeEntry && (
        <Modal title={`Feedback — ${activeEntry.category}`} onClose={() => setActiveEntry(null)}>
          <div className="space-y-3 text-sm">
            <p className="text-gray-900">{activeEntry.message}</p>
            <p className="text-gray-500">Rating: {"★".repeat(activeEntry.rating)}{"☆".repeat(5 - activeEntry.rating)}</p>
            <p className="text-gray-500">From: {activeEntry.submittedBy}</p>
            <p className="text-gray-500">Submitted: {activeEntry.submittedAt}</p>
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              {activeEntry.status === "new" && (
                <button
                  onClick={() => markReviewed(activeEntry.id)}
                  className="min-h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Mark as reviewed
                </button>
              )}
              <button
                onClick={() => removeEntry(activeEntry.id)}
                className="min-h-11 flex-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}