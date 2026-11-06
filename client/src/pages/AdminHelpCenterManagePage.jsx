// AdminHelpCenterManagePage.jsx
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

// TODO (backend step): load the live Help Center content from the API instead of this seed data,
// and PUT/POST changes back to it on save.
const initialCategories = [
  {
    id: "getting-started",
    title: "Getting started",
    glyph: "🚀",
    faqs: [
      { id: "gs-1", q: "How do I create a Credify account?", a: "Sign up from the landing page and choose whether you're a candidate or a recruiter." },
      { id: "gs-2", q: "Is Credify free to use?", a: "Candidates can verify skills for free. Recruiters have a free tier with paid plans for higher usage." },
    ],
  },
  {
    id: "assessments",
    title: "Assessments",
    glyph: "📝",
    faqs: [
      { id: "as-1", q: "How long does an assessment take?", a: "Most assessments take 20–40 minutes depending on the number of questions." },
    ],
  },
  {
    id: "verification",
    title: "Verification",
    glyph: "✅",
    faqs: [
      { id: "ver-1", q: "How is a skill marked verified?", a: "A skill is verified once you pass its related assessment with a sufficient score." },
    ],
  },
];

export default function AdminHelpCenterManagePage() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState(initialCategories[0].id);
  const [categoryModal, setCategoryModal] = useState(null); // { mode: 'add' | 'edit', data }
  const [faqModal, setFaqModal] = useState(null); // { mode: 'add' | 'edit', data }
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

  const selected = categories.find((c) => c.id === selectedId) || categories[0];

  function flashSaved() {
    setSavedMessage("Saved.");
    setTimeout(() => setSavedMessage(""), 2500);
  }

  function saveCategory(form) {
    if (categoryModal.mode === "add") {
      const id = form.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      setCategories((prev) => [...prev, { id, title: form.title, glyph: form.glyph || "📁", faqs: [] }]);
      setSelectedId(id);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === form.id ? { ...c, title: form.title, glyph: form.glyph } : c)),
      );
    }
    setCategoryModal(null);
    flashSaved();
  }

  function removeCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id && categories.length > 1) {
      setSelectedId(categories.find((c) => c.id !== id).id);
    }
    flashSaved();
  }

  function saveFaq(form) {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== selected.id) return c;
        if (faqModal.mode === "add") {
          return { ...c, faqs: [...c.faqs, { id: "faq-" + Date.now(), q: form.q, a: form.a }] };
        }
        return { ...c, faqs: c.faqs.map((f) => (f.id === form.id ? { ...f, q: form.q, a: form.a } : f)) };
      }),
    );
    setFaqModal(null);
    flashSaved();
  }

  function removeFaq(faqId) {
    setCategories((prev) =>
      prev.map((c) => (c.id !== selected.id ? c : { ...c, faqs: c.faqs.filter((f) => f.id !== faqId) })),
    );
    flashSaved();
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Manage Help Center</h1>
            <p className="text-sm text-gray-500">Edit the FAQ categories and questions shown on the public Help Center page.</p>
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

        <main className="flex-1 space-y-4 px-6 py-8 lg:px-10">
          {savedMessage && (
            <div className="rounded-lg bg-[#E8F5EE] px-4 py-2 text-sm font-medium text-[#15803D]">{savedMessage}</div>
          )}

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                <button
                  onClick={() => setCategoryModal({ mode: "add", data: { title: "", glyph: "" } })}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      c.id === selected.id ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{c.glyph}</span>
                    <span className="flex-1 truncate">{c.title}</span>
                    <span className="text-xs text-gray-400">{c.faqs.length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selected.glyph} {selected.title}</h2>
                  <p className="text-sm text-gray-500">{selected.faqs.length} question{selected.faqs.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCategoryModal({ mode: "edit", data: { id: selected.id, title: selected.title, glyph: selected.glyph } })}
                    className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    Edit category
                  </button>
                  <button
                    onClick={() => removeCategory(selected.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                  >
                    Delete category
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {selected.faqs.map((f) => (
                  <div key={f.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{f.q}</p>
                      <div className="flex shrink-0 gap-2">
                        <button onClick={() => setFaqModal({ mode: "edit", data: f })} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                        <button onClick={() => removeFaq(f.id)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{f.a}</p>
                  </div>
                ))}
                {selected.faqs.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-500">No questions in this category yet.</p>
                )}
              </div>

              <button
                onClick={() => setFaqModal({ mode: "add", data: { q: "", a: "" } })}
                className="mt-4 min-h-11 w-full rounded-lg border border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                + Add question
              </button>
            </div>
          </div>
        </main>
      </div>

      {categoryModal && (
        <Modal title={categoryModal.mode === "add" ? "Add category" : "Edit category"} onClose={() => setCategoryModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCategory(categoryModal.data);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Title</label>
              <input
                value={categoryModal.data.title}
                onChange={(e) => setCategoryModal((m) => ({ ...m, data: { ...m.data, title: e.target.value } }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Icon (emoji)</label>
              <input
                value={categoryModal.data.glyph}
                onChange={(e) => setCategoryModal((m) => ({ ...m, data: { ...m.data, glyph: e.target.value } }))}
                placeholder="📁"
                className="w-24 rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark">
              Save
            </button>
          </form>
        </Modal>
      )}

      {faqModal && (
        <Modal title={faqModal.mode === "add" ? "Add question" : "Edit question"} onClose={() => setFaqModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveFaq(faqModal.data);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Question</label>
              <input
                value={faqModal.data.q}
                onChange={(e) => setFaqModal((m) => ({ ...m, data: { ...m.data, q: e.target.value } }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Answer</label>
              <textarea
                rows={4}
                value={faqModal.data.a}
                onChange={(e) => setFaqModal((m) => ({ ...m, data: { ...m.data, a: e.target.value } }))}
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