// src/pages/AdminSystemSettingsPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

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

function Toggle({ on, onToggle, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`w-10 h-5.5 rounded-full relative transition-colors ${on ? "bg-green-600" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${on ? "translate-x-4.5" : "translate-x-0"}`}
      />
    </button>
  );
}

const SESSION_OPTIONS = [
  [15, "15 minutes"],
  [30, "30 minutes"],
  [60, "1 hour"],
  [120, "2 hours"],
  [240, "4 hours"],
  [1440, "24 hours"],
];
const MIN_SCORE_OPTIONS = [30, 40, 50, 60, 70];
const DAY_UNITS = [
  ["Years", 365],
  ["Months", 30],
  ["Weeks", 7],
  ["Days", 1],
];
const BOOLEAN_KEYS = [
  "allowRegistration",
  "requireEmailVerification",
  "allowRecruiterRegistration",
  "randomizeQuestions",
  "skillRecommendations",
  "careerRecommendations",
  "candidateMatching",
];

// Days (or null = never) -> { value, unit } using the largest unit that divides evenly.
function daysToForm(days) {
  if (days == null) return { value: "", unit: "Never" };
  const [unit, size] = DAY_UNITS.find(([, n]) => days % n === 0);
  return { value: String(days / size), unit };
}
function formToDays({ value, unit }) {
  if (unit === "Never") return null;
  return Number(value) * DAY_UNITS.find(([u]) => u === unit)[1];
}

// Server settings -> editable form (platformDisabled is managed in the Danger zone, not here).
function toForm(s) {
  return {
    platformName: s.platformName,
    platformDescription: s.platformDescription ?? "",
    defaultLanguage: s.defaultLanguage,
    ...Object.fromEntries(BOOLEAN_KEYS.map((k) => [k, s[k]])),
    duration:
      s.maxAssessmentDurationMinutes % 60 === 0
        ? { value: String(s.maxAssessmentDurationMinutes / 60), unit: "hours" }
        : { value: String(s.maxAssessmentDurationMinutes), unit: "minutes" },
    maxAttempts: String(s.maxAttempts),
    defaultPassingScore: String(s.defaultPassingScore),
    verificationExpiry: daysToForm(s.verificationExpiryDays),
    verificationBadgeMode: s.verificationBadgeMode,
    minScoreForVerification: String(s.minScoreForVerification),
    recruiterAccessControl: s.recruiterAccessControl,
    sessionTimeoutMinutes: String(s.sessionTimeoutMinutes),
    dataRetention: daysToForm(s.dataRetentionDays),
  };
}

// Form -> API body, or { error } if a number is invalid.
function toBody(f) {
  const int = (label, v, min, max) => {
    const n = Number(v);
    if (v === "" || !Number.isInteger(n) || n < min || n > max) throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
    return n;
  };
  try {
    const durationMinutes = int("Maximum assessment duration", f.duration.value, 1, 1440) * (f.duration.unit === "hours" ? 60 : 1);
    if (durationMinutes > 1440) throw new Error("Maximum assessment duration can't be more than 24 hours.");
    const days = (label, field, max) => {
      if (field.unit === "Never") return null;
      int(label, field.value, 1, max);
      return formToDays(field);
    };
    return {
      body: {
        platformName: f.platformName,
        platformDescription: f.platformDescription,
        defaultLanguage: f.defaultLanguage,
        ...Object.fromEntries(BOOLEAN_KEYS.map((k) => [k, f[k]])),
        maxAssessmentDurationMinutes: durationMinutes,
        maxAttempts: int("Maximum attempts", f.maxAttempts, 1, 100),
        defaultPassingScore: int("Passing score", f.defaultPassingScore, 0, 100),
        verificationExpiryDays: days("Verification expiry", f.verificationExpiry, 3650),
        verificationBadgeMode: f.verificationBadgeMode,
        minScoreForVerification: Number(f.minScoreForVerification),
        recruiterAccessControl: f.recruiterAccessControl,
        sessionTimeoutMinutes: Number(f.sessionTimeoutMinutes),
        dataRetentionDays: days("Data retention", f.dataRetention, 36500),
      },
    };
  } catch (err) {
    return { error: err.message };
  }
}

export default function AdminSystemSettingsPage() {
  const [saved, setSaved] = useState(null); // last settings from the server
  const [form, setForm] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { kind: "success" | "error", text }
  const [confirmingPlatform, setConfirmingPlatform] = useState(false);
  const [dangerMessage, setDangerMessage] = useState("");

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

  useEffect(() => {
    api
      .get("/api/admin/settings")
      .then((s) => {
        setSaved(s);
        setForm(toForm(s));
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setLoadError(err.message || "Could not load settings.");
      })
      .finally(() => setLoading(false));
    // Quick metrics: the dashboard endpoint already counts these.
    api
      .get("/api/admin/dashboard")
      .then((d) => setMetrics({ candidates: d.candidatesCount, recruiters: d.recruitersCount }))
      .catch((err) => console.error("Failed to load metrics:", err));
  }, []);

  const dirty = form && saved && JSON.stringify(form) !== JSON.stringify(toForm(saved));

  function update(key, value) {
    setMessage(null);
    setForm((f) => ({ ...f, [key]: value }));
  }
  const flip = (key) => update(key, !form[key]);

  async function handleSave() {
    const { body, error } = toBody(form);
    if (error) {
      setMessage({ kind: "error", text: error });
      return;
    }
    setSaving(true);
    try {
      const s = await api.put("/api/admin/settings", body);
      setSaved(s);
      setForm(toForm(s));
      setMessage({ kind: "success", text: "Settings saved." });
    } catch (err) {
      setMessage({ kind: "error", text: err.message || "Could not save settings." });
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(toForm(saved));
    setMessage(null);
  }

  async function setPlatformDisabled(disabled) {
    setSaving(true);
    setDangerMessage("");
    try {
      const s = await api.put("/api/admin/settings", { platformDisabled: disabled });
      setSaved(s);
      setConfirmingPlatform(false);
      setDangerMessage(disabled ? "Platform disabled. Only admins can sign in." : "Platform enabled again.");
    } catch (err) {
      setDangerMessage(err.message || "Could not change the platform status.");
    } finally {
      setSaving(false);
    }
  }

  const selectClass = "w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm";

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
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          {loading && <p className="py-10 text-center text-sm text-slate-500">Loading settings…</p>}
          {!loading && loadError && <p className="py-10 text-center text-sm text-red-600">{loadError}</p>}

          {!loading && form && (
            <>
              {saved.platformDisabled && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                  <span className="font-semibold">Maintenance mode is on.</span> Only admins can sign in; everyone else is signed out until it's turned off below.
                </div>
              )}

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">General settings</h3>
                  <div>
                    <label htmlFor="platformName" className="text-sm font-semibold text-slate-900 block mb-2">Platform name</label>
                    <input
                      id="platformName"
                      value={form.platformName}
                      onChange={(e) => update("platformName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="platformDescription" className="text-sm font-semibold text-slate-900 block mb-2">Platform description</label>
                    <textarea
                      id="platformDescription"
                      value={form.platformDescription}
                      onChange={(e) => update("platformDescription", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="defaultLanguage" className="text-sm font-semibold text-slate-900 block mb-2">Default language</label>
                    <select id="defaultLanguage" value={form.defaultLanguage} onChange={(e) => update("defaultLanguage", e.target.value)} className={selectClass}>
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                      <option value="en-AU">English (Australia)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">User management</h3>
                  {[
                    ["allowRegistration", "Allow new registration"],
                    ["requireEmailVerification", "Require email verification"],
                    ["allowRecruiterRegistration", "Allow recruiter registration"],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{label}</span>
                      <Toggle on={form[key]} onToggle={() => flip(key)} label={label} />
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Quick metrics</h4>
                    {metrics ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{metrics.candidates.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Candidates</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{metrics.recruiters.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Recruiters</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Loading…</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">Assessment settings</h3>
                  <div>
                    <label htmlFor="maxDuration" className="text-sm font-semibold text-slate-900 block mb-2">Maximum assessment duration</label>
                    <div className="flex gap-2">
                      <input
                        id="maxDuration"
                        type="number"
                        min={1}
                        value={form.duration.value}
                        onChange={(e) => update("duration", { ...form.duration, value: e.target.value })}
                        className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                      <select
                        aria-label="Duration unit"
                        value={form.duration.unit}
                        onChange={(e) => update("duration", { ...form.duration, unit: e.target.value })}
                        className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                      >
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="maxAttempts" className="text-sm font-semibold text-slate-900 block mb-2">Maximum attempts</label>
                    <input
                      id="maxAttempts"
                      type="number"
                      min={1}
                      max={100}
                      value={form.maxAttempts}
                      onChange={(e) => update("maxAttempts", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-500">Per candidate, per assessment (retakes included).</p>
                  </div>
                  <div>
                    <label htmlFor="defaultPassingScore" className="text-sm font-semibold text-slate-900 block mb-2">Passing score</label>
                    <div className="relative">
                      <input
                        id="defaultPassingScore"
                        type="number"
                        min={0}
                        max={100}
                        value={form.defaultPassingScore}
                        onChange={(e) => update("defaultPassingScore", e.target.value)}
                        className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">%</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Default for new assessments.</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">Randomize questions</span>
                    <Toggle on={form.randomizeQuestions} onToggle={() => flip("randomizeQuestions")} label="Randomize questions" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">Verification settings</h3>
                  <DayPeriodField
                    id="verificationExpiry"
                    label="Verification expiry"
                    field={form.verificationExpiry}
                    onChange={(v) => update("verificationExpiry", v)}
                  />
                  <div>
                    <label htmlFor="verificationBadgeMode" className="text-sm font-semibold text-slate-900 block mb-2">Verification badges</label>
                    <select id="verificationBadgeMode" value={form.verificationBadgeMode} onChange={(e) => update("verificationBadgeMode", e.target.value)} className={selectClass}>
                      <option>Allowed</option>
                      <option>Not allowed</option>
                      <option>Admin approval required</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="minScoreForVerification" className="text-sm font-semibold text-slate-900 block mb-2">Minimum score for verification</label>
                    <select id="minScoreForVerification" value={form.minScoreForVerification} onChange={(e) => update("minScoreForVerification", e.target.value)} className={selectClass}>
                      {[...new Set([...MIN_SCORE_OPTIONS, Number(form.minScoreForVerification)])].sort((a, b) => a - b).map((n) => (
                        <option key={n} value={String(n)}>{n}%</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">Privacy & security</h3>
                  <div>
                    <label htmlFor="recruiterAccessControl" className="text-sm font-semibold text-slate-900 block mb-2">Recruiter access controls</label>
                    <select id="recruiterAccessControl" value={form.recruiterAccessControl} onChange={(e) => update("recruiterAccessControl", e.target.value)} className={selectClass}>
                      <option>All candidates</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sessionTimeout" className="text-sm font-semibold text-slate-900 block mb-2">Session timeout</label>
                    <select id="sessionTimeout" value={form.sessionTimeoutMinutes} onChange={(e) => update("sessionTimeoutMinutes", e.target.value)} className={selectClass}>
                      {SESSION_OPTIONS.map(([m, label]) => (
                        <option key={m} value={String(m)}>{label}</option>
                      ))}
                      {!SESSION_OPTIONS.some(([m]) => String(m) === form.sessionTimeoutMinutes) && (
                        <option value={form.sessionTimeoutMinutes}>{form.sessionTimeoutMinutes} minutes</option>
                      )}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">Applies to new sign-ins.</p>
                  </div>
                  <DayPeriodField
                    id="dataRetention"
                    label="Data retention"
                    field={form.dataRetention}
                    onChange={(v) => update("dataRetention", v)}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="font-medium text-slate-900">Recommendations</h3>
                  {[
                    ["skillRecommendations", "Enable skill recommendations", "Suggest skills to improve for a role."],
                    ["careerRecommendations", "Enable career recommendations", "Suggest career roles that fit a profile."],
                    ["candidateMatching", "Enable candidate matching", "Show recruiters how well candidates match their target role."],
                  ].map(([key, label, desc], i) => (
                    <div key={key} className={i > 0 ? "border-t border-slate-100 pt-4" : ""}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{label}</span>
                        <Toggle on={form[key]} onToggle={() => flip(key)} label={label} />
                      </div>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  onClick={handleReset}
                  disabled={saving || !dirty}
                  className="px-6 py-3 rounded-xl border border-primary text-primary font-semibold text-sm disabled:opacity-50"
                >
                  Reset changes
                </button>
                {message && (
                  <span role={message.kind === "error" ? "alert" : "status"} className={`text-sm ${message.kind === "error" ? "text-red-600" : "text-green-700"}`}>
                    {message.text}
                  </span>
                )}
                {!message && dirty && <span className="text-sm text-slate-500">You have unsaved changes.</span>}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-semibold text-red-800 mb-1">⚠ Danger zone</h3>
                <p className="text-sm text-red-700 mb-4">These actions can affect the entire platform.</p>
                {confirmingPlatform ? (
                  <div className="rounded-xl border border-red-300 bg-white p-4 space-y-3">
                    <p className="text-sm text-red-800">
                      {saved.platformDisabled
                        ? "Enable the platform? Candidates and recruiters will be able to sign in again."
                        : "Disable the platform? All candidates and recruiters will be signed out immediately and can't sign in until it's enabled again. Admins are not affected."}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPlatformDisabled(!saved.platformDisabled)}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        {saved.platformDisabled ? "Yes, enable platform" : "Yes, disable platform"}
                      </button>
                      <button onClick={() => setConfirmingPlatform(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setDangerMessage(""); setConfirmingPlatform(true); }}
                      className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold"
                    >
                      {saved.platformDisabled ? "Enable platform" : "Disable platform"}
                    </button>
                    {/* Deliberately not implemented: no real data deletion from the UI. */}
                    <button
                      onClick={() => setDangerMessage("Resetting system data isn't available.")}
                      className="px-5 py-2.5 rounded-xl bg-red-600/60 text-white text-sm font-semibold cursor-not-allowed"
                    >
                      Reset system data
                    </button>
                  </div>
                )}
                {dangerMessage && <p role="status" className="mt-3 text-sm text-red-800">{dangerMessage}</p>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// "Never" or a number of days/weeks/months/years.
function DayPeriodField({ id, label, field, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-900 block mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          id={id}
          type="number"
          min={1}
          value={field.unit === "Never" ? "" : field.value}
          disabled={field.unit === "Never"}
          placeholder={field.unit === "Never" ? "Never" : ""}
          onChange={(e) => onChange({ ...field, value: e.target.value })}
          className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm disabled:bg-slate-50"
        />
        <select
          aria-label={`${label} unit`}
          value={field.unit}
          onChange={(e) => onChange({ value: e.target.value === "Never" ? "" : field.value || "1", unit: e.target.value })}
          className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
        >
          <option>Never</option>
          <option>Days</option>
          <option>Weeks</option>
          <option>Months</option>
          <option>Years</option>
        </select>
      </div>
    </div>
  );
}
