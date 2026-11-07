// AdminTermsOfServiceManagePage.jsx
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

function AdminHeader({ openMenu, menuRef, toggleMenu, title, subtitle }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
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
  );
}

// TODO (backend step): load the live Terms of Service content from the API and PUT changes back on save.
const initialSections = [
  { id: "s1", heading: "Acceptance of terms", body: "By creating an account or using Credify, you agree to these Terms of Service." },
  { id: "s2", heading: "Acceptable use", body: "You agree not to misrepresent your skills, impersonate another person, or attempt to bypass assessment integrity checks." },
  { id: "s3", heading: "Account termination", body: "Credify may suspend or terminate accounts that violate these terms or engage in fraudulent activity." },
];

export default function AdminTermsOfServiceManagePage() {
  const [lastUpdated, setLastUpdated] = useState("2026-10-01");
  const [sections, setSections] = useState(initialSections);
  const [sectionModal, setSectionModal] = useState(null); // { mode, data }
  const [savedMessage, setSavedMessage] = useState("");

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

  function flashSaved() {
    setSavedMessage("Saved.");
    setTimeout(() => setSavedMessage(""), 2500);
  }

  function saveSection(form) {
    if (sectionModal.mode === "add") {
      setSections((prev) => [...prev, { id: "sec-" + Date.now(), heading: form.heading, body: form.body }]);
    } else {
      setSections((prev) => prev.map((s) => (s.id === form.id ? { ...s, heading: form.heading, body: form.body } : s)));
    }
    setSectionModal(null);
    flashSaved();
  }

  function removeSection(id) {
    setSections((prev) => prev.filter((s) => s.id !== id));
    flashSaved();
  }

  function moveSection(id, dir) {
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function handlePublish() {
    // TODO: POST { lastUpdated, sections } to /api/admin/terms-of-service
    flashSaved();
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <AdminHeader
          openMenu={openMenu}
          menuRef={menuRef}
          toggleMenu={toggleMenu}
          title="Manage Terms of Service"
          subtitle="Edit the sections shown on the public Terms of Service page."
        />

        <main className="flex-1 space-y-4 px-6 py-8 lg:px-10">
          {savedMessage && (
            <div className="rounded-lg bg-[#E8F5EE] px-4 py-2 text-sm font-medium text-[#15803D]">{savedMessage}</div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Last updated</label>
              <input
                type="date"
                value={lastUpdated}
                onChange={(e) => setLastUpdated(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              />
            </div>
            <button onClick={handlePublish} className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark">
              Publish changes
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{s.heading}</h3>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => moveSection(s.id, -1)} disabled={i === 0} className="text-xs font-semibold text-gray-500 disabled:opacity-30">↑</button>
                    <button onClick={() => moveSection(s.id, 1)} disabled={i === sections.length - 1} className="text-xs font-semibold text-gray-500 disabled:opacity-30">↓</button>
                    <button onClick={() => setSectionModal({ mode: "edit", data: s })} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                    <button onClick={() => removeSection(s.id)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSectionModal({ mode: "add", data: { heading: "", body: "" } })}
            className="min-h-11 w-full rounded-lg border border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            + Add section
          </button>
        </main>
      </div>

      {sectionModal && (
        <Modal title={sectionModal.mode === "add" ? "Add section" : "Edit section"} onClose={() => setSectionModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection(sectionModal.data);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Heading</label>
              <input
                value={sectionModal.data.heading}
                onChange={(e) => setSectionModal((m) => ({ ...m, data: { ...m.data, heading: e.target.value } }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Body</label>
              <textarea
                rows={6}
                value={sectionModal.data.body}
                onChange={(e) => setSectionModal((m) => ({ ...m, data: { ...m.data, body: e.target.value } }))}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark">
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}