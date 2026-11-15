// src/pages/SettingsPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function SettingsPage() {
  const navigate = useNavigate();

  // TODO (backend step): load the signed-in user's real account details.
  const [account, setAccount] = useState({
    fullName: "Chethina Sri",
    email: "chethina@example.com",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [theme, setTheme] = useState("light"); // 'light' | 'dark' | 'system'

  const [savedMessage, setSavedMessage] = useState("");

  function handleSave(e) {
    e.preventDefault();
    // TODO (backend step): PATCH /api/account/settings with account, password change,
    // notification preferences and theme.
    setSavedMessage("Settings saved.");
    setTimeout(() => setSavedMessage(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between lg:px-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
              <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary">Credify</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">Manage your account, notifications and appearance.</p>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
            {savedMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-medium text-slate-900">Account</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full name</label>
              <input
                value={account.fullName}
                onChange={(e) => setAccount((a) => ({ ...a, fullName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={account.email}
                onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Change password</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={passwords.next}
                    onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-medium text-slate-900">Notifications</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Email notifications</p>
                <p className="text-xs text-slate-500">Updates about your account sent to your email.</p>
              </div>
              <Toggle on={emailNotifications} onToggle={() => setEmailNotifications((v) => !v)} />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Push notifications</p>
                <p className="text-xs text-slate-500">Browser or app notifications for important updates.</p>
              </div>
              <Toggle on={pushNotifications} onToggle={() => setPushNotifications((v) => !v)} />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Assessment reminders</p>
                <p className="text-xs text-slate-500">Reminders about upcoming or incomplete assessments.</p>
              </div>
              <Toggle on={assessmentReminders} onToggle={() => setAssessmentReminders((v) => !v)} />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Marketing emails</p>
                <p className="text-xs text-slate-500">News, tips and product updates from Credify.</p>
              </div>
              <Toggle on={marketingEmails} onToggle={() => setMarketingEmails((v) => !v)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-medium text-slate-900">Appearance</h3>
            <div className="flex gap-3">
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize ${
                    theme === t
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}