import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Assessments", to: "/candidate/assessments" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "Browse Jobs", to: "/candidate/jobs" },
  { label: "My Profile", to: "/candidate/profile" },
];

const MIN_PASSWORD_LENGTH = 8;

function emptyAbout() {
  return { bio: "", careerInterests: "", education: "", technicalSkills: "", links: "" };
}

function emptyPasswordForm() {
  return { currentPassword: "", newPassword: "", confirmPassword: "" };
}

// Comma- (or newline-) separated text -> trimmed, non-empty, unique items.
function splitList(text) {
  if (!text) return [];
  return [...new Set(text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))];
}

// Links are free text; make sure they open as absolute URLs.
function toHref(link) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

function initials(name = "") {
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "";
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function Notice({ error, success }) {
  if (error) {
    return <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>;
  }
  if (success) {
    return <p role="status" className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">{success}</p>;
  }
  return null;
}

const notifications = [
  {
    title: "New assessment recommended",
    detail: "React Performance assessment is ready for you",
  },
  { title: "Skill verified", detail: "Your Python skill has been verified" },
  {
    title: "Data Analysis needs verification",
    detail: "Take an assessment to verify this skill",
  },
];

function ScoreRing({ pct }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-[72px] w-[72px]">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#2563EB"
          strokeWidth="6"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{pct}%</span>
      </div>
    </div>
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
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default function CandidateProfilePage() {
  const { pathname } = useLocation();

  // which modal is open
  const [openModal, setOpenModal] = useState(null); // 'editProfile' | 'aboutMe' | 'projects' | 'certifications' | 'verification' | 'privacy' | 'password' | null

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

  // ---- Data from GET /api/candidates/me ----
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // Modal form state
  const [nameDraft, setNameDraft] = useState("");
  const [aboutDraft, setAboutDraft] = useState(emptyAbout());
  const [newProject, setNewProject] = useState({ name: "", link: "" });
  const [editingProject, setEditingProject] = useState(null); // { id, name, link }
  const [newCertification, setNewCertification] = useState("");
  const [editingCertification, setEditingCertification] = useState(null); // { id, name }
  const [visibilityDraft, setVisibilityDraft] = useState("public");
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm());

  async function loadProfile() {
    try {
      setMe(await api.get("/api/candidates/me"));
      setLoadError("");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setLoadError(err.message || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const displayName = me?.name || "";

  function openModalFor(name) {
    setModalError("");
    setModalSuccess("");
    if (name === "editProfile") setNameDraft(me.name);
    if (name === "aboutMe") {
      setAboutDraft({
        bio: me.bio ?? "",
        careerInterests: me.careerInterests ?? "",
        education: me.education ?? "",
        technicalSkills: me.technicalSkills ?? "",
        links: me.links ?? "",
      });
    }
    if (name === "projects") {
      setNewProject({ name: "", link: "" });
      setEditingProject(null);
    }
    if (name === "certifications") {
      setNewCertification("");
      setEditingCertification(null);
    }
    if (name === "privacy") setVisibilityDraft(me.visibility);
    if (name === "password") setPasswordForm(emptyPasswordForm());
    setOpenModal(name);
  }

  // Runs an API call for a modal: shows errors in the modal, refreshes the
  // profile afterwards so the page always reflects what's stored.
  async function run(action, { close = false } = {}) {
    setSaving(true);
    setModalError("");
    setModalSuccess("");
    try {
      const result = await action();
      if (result && result.email) setMe(result); // PUT /me returns the full profile
      else await loadProfile();
      if (close) setOpenModal(null);
      return true;
    } catch (err) {
      setModalError(err.message || "Something went wrong.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  // ---- Profile + About Me ----
  function saveName(e) {
    e.preventDefault();
    if (!nameDraft.trim()) return setModalError("Enter your full name.");
    run(() => api.put("/api/candidates/me", { name: nameDraft.trim() }), { close: true });
  }

  function saveAbout(e) {
    e.preventDefault();
    // technicalSkills is stored as comma-separated text; tidy the spacing.
    const technicalSkills = splitList(aboutDraft.technicalSkills).join(", ");
    run(
      () =>
        api.put("/api/candidates/me", {
          bio: aboutDraft.bio,
          careerInterests: aboutDraft.careerInterests,
          education: aboutDraft.education,
          technicalSkills,
          links: aboutDraft.links,
        }),
      { close: true },
    );
  }

  // ---- Projects ----
  function addProject(e) {
    e.preventDefault();
    if (!newProject.name.trim()) return setModalError("Enter a project name.");
    run(() => api.post("/api/candidates/me/projects", newProject)).then((ok) => {
      if (ok) setNewProject({ name: "", link: "" });
    });
  }

  function saveProject(e) {
    e.preventDefault();
    if (!editingProject.name.trim()) return setModalError("Project name can't be empty.");
    run(() =>
      api.put(`/api/candidates/me/projects/${editingProject.id}`, {
        name: editingProject.name,
        link: editingProject.link,
      }),
    ).then((ok) => ok && setEditingProject(null));
  }

  function removeProject(id) {
    run(() => api.delete(`/api/candidates/me/projects/${id}`));
  }

  // ---- Certifications ----
  function addCertification(e) {
    e.preventDefault();
    if (!newCertification.trim()) return setModalError("Enter a certification name.");
    run(() => api.post("/api/candidates/me/certifications", { name: newCertification })).then(
      (ok) => ok && setNewCertification(""),
    );
  }

  function saveCertification(e) {
    e.preventDefault();
    if (!editingCertification.name.trim()) return setModalError("Certification name can't be empty.");
    run(() =>
      api.put(`/api/candidates/me/certifications/${editingCertification.id}`, {
        name: editingCertification.name,
      }),
    ).then((ok) => ok && setEditingCertification(null));
  }

  function removeCertification(id) {
    run(() => api.delete(`/api/candidates/me/certifications/${id}`));
  }

  // ---- Privacy ----
  function saveVisibility(e) {
    e.preventDefault();
    run(() => api.put("/api/candidates/me", { visibility: visibilityDraft })).then(
      (ok) => ok && setModalSuccess(`Your profile is now ${visibilityDraft}.`),
    );
  }

  // ---- Password ----
  async function changePassword(e) {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    setModalSuccess("");
    if (!currentPassword) return setModalError("Enter your current password.");
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return setModalError(`Your new password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    if (newPassword !== confirmPassword) return setModalError("The new passwords don't match.");
    setSaving(true);
    setModalError("");
    try {
      await api.post("/api/auth/change-password", { currentPassword, newPassword });
      setPasswordForm(emptyPasswordForm());
      setModalSuccess("Your password has been changed.");
    } catch (err) {
      setModalError(err.message || "Could not change your password.");
    } finally {
      setSaving(false);
    }
  }

  // ---- Derived values ----
  const verifiedSkills = me?.verifiedSkills ?? [];
  const results = me?.assessmentResults ?? [];
  const projects = me?.projects ?? [];
  const certifications = me?.certifications ?? [];
  const technicalSkills = splitList(me?.technicalSkills);
  const links = splitList(me?.links);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 px-2">
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path
              d="M16 7l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9v-6z"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12.8 16.2l2.4 2.4 4-4.4"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold leading-none tracking-tight text-primary">
            Credify
          </span>
        </Link>

        <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Candidate workspace
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                  active ? "text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">
              Manage your professional identity and account
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-primary">
                  {initials(displayName)}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {displayName}
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
                    to="/candidate/profile"
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
                  <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          {loading && (
            <p className="py-10 text-center text-sm text-gray-500">Loading your profile…</p>
          )}
          {!loading && loadError && (
            <p className="py-10 text-center text-sm text-red-600">{loadError}</p>
          )}

          {!loading && !loadError && me && (
            <>
              {/* Profile header card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-semibold text-primary">
                      {initials(me.name)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{me.name}</h2>
                        {verifiedSkills.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-0.5 text-xs font-semibold text-[#15803D]">
                            ✓ Verified Profile
                          </span>
                        )}
                      </div>
                      {/* Read-only: chosen on the Career Role page */}
                      <p className="mt-1 text-sm text-gray-600">
                        {me.targetCareerRole?.name || "No target career role selected"}
                      </p>
                      {me.education && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                          🎓 {me.education}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openModalFor("editProfile")}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    {plural(verifiedSkills.length, "verified skill")} ·{" "}
                    {plural(results.length, "assessment result")} ·{" "}
                    {plural(projects.length, "project")}
                  </p>
                  <p className="text-gray-400">
                    Your candidate profile · {me.visibility === "private" ? "Private" : "Public"}
                  </p>
                </div>
              </div>

              {/* About + skills */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">About Me</h3>
                    <button
                      onClick={() => openModalFor("aboutMe")}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className={`mt-3 whitespace-pre-line text-sm leading-6 ${me.bio ? "text-gray-600" : "text-gray-400"}`}>
                    {me.bio || "No bio yet. Tell recruiters a little about yourself."}
                  </p>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Career interests
                  </p>
                  {me.careerInterests ? (
                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                      {me.careerInterests}
                    </span>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">Not added yet</p>
                  )}

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Education
                  </p>
                  <p className={`mt-2 flex items-center gap-2 text-sm font-medium ${me.education ? "text-gray-700" : "text-gray-400"}`}>
                    {me.education ? <>🎓 {me.education}</> : "Not added yet"}
                  </p>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Technical skills <span className="normal-case font-normal">(self-reported)</span>
                  </p>
                  {technicalSkills.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {technicalSkills.map((s) => (
                        <span key={s} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">Not added yet</p>
                  )}

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Links
                  </p>
                  {links.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {links.map((l) => (
                        <li key={l}>
                          <a
                            href={toHref(l)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-sm text-primary hover:underline"
                          >
                            {l} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">Not added yet</p>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-base font-semibold text-gray-900">Verified Skills</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Skills you&rsquo;ve verified, with your best assessment score.
                  </p>
                  {verifiedSkills.length === 0 ? (
                    <p className="mt-5 text-sm text-gray-400">
                      No verified skills yet.{" "}
                      <Link to="/candidate/assessments" className="font-semibold text-primary hover:underline">
                        Take an assessment
                      </Link>
                    </p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {verifiedSkills.map((s) => (
                        <div key={s.skillName}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 font-medium text-gray-900">
                              {s.skillName}
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2 py-0.5 text-[11px] font-semibold text-[#15803D]">
                                ✓ Verified
                              </span>
                            </span>
                            {s.score != null && (
                              <span className="font-semibold text-gray-900">{s.score}%</span>
                            )}
                          </div>
                          {/* No score -> no bar, rather than a misleading 0% */}
                          {s.score != null && (
                            <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
                              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Projects</h3>
                  <button
                    onClick={() => openModalFor("projects")}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Manage
                  </button>
                </div>
                <ul className="mt-4 divide-y divide-gray-100">
                  {projects.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                        📁
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                        {p.link && (
                          <a
                            href={toHref(p.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-xs text-gray-500 hover:underline"
                          >
                            {p.link} ↗
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                  {projects.length === 0 && (
                    <p className="py-3 text-sm text-gray-500">No projects added yet.</p>
                  )}
                </ul>
              </div>

              {/* Assessment results + certifications */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-base font-semibold text-gray-900">Assessment Results</h3>
                  {results.length === 0 ? (
                    <p className="mt-5 text-sm text-gray-400">No completed assessments yet.</p>
                  ) : (
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      {results.map((a, i) => (
                        <div key={`${a.skillName}-${a.completedAt}-${i}`} className="rounded-lg border border-gray-200 p-4 text-center">
                          <p className="text-sm font-semibold text-gray-900">{a.skillName}</p>
                          <p className="text-xs text-gray-500">{formatDate(a.completedAt)}</p>
                          <div className="mt-3">
                            {a.score != null ? (
                              <ScoreRing pct={a.score} />
                            ) : (
                              <p className="py-6 text-sm text-gray-400">Not scored</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Certifications</h3>
                    <button
                      onClick={() => openModalFor("certifications")}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <ul className="mt-4 divide-y divide-gray-100">
                    {certifications.map((c) => (
                      <li key={c.id} className="flex items-center gap-3 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                          🏅
                        </div>
                        <p className="flex-1 text-sm font-semibold text-gray-900">{c.name}</p>
                      </li>
                    ))}
                    {certifications.length === 0 && (
                      <p className="py-3 text-sm text-gray-500">No certifications added yet.</p>
                    )}
                  </ul>
                </div>
              </div>

              {/* Verified banner */}
              {verifiedSkills.length > 0 ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#15803D]">✓ Verified Profile</p>
                  <p className="mt-1 text-sm text-green-800">
                    {plural(verifiedSkills.length, "verified skill")} and{" "}
                    {plural(results.length, "completed assessment")} on your profile.
                  </p>
                  <button
                    onClick={() => openModalFor("verification")}
                    className="mt-2 inline-block text-sm font-semibold text-[#15803D] hover:underline"
                  >
                    View verification details →
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900">Not verified yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Pass an assessment to verify your first skill.
                  </p>
                  <button
                    onClick={() => openModalFor("verification")}
                    className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    View verification details →
                  </button>
                </div>
              )}

              {/* Account settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Make Credify work for you</h3>
                <p className="mt-1 text-sm text-gray-500">Keep your account secure and choose who can see your profile.</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 lg:max-w-2xl">
                <h4 className="font-semibold text-gray-900">Account settings</h4>

                <div className="mt-4 border-b border-gray-100 pb-5">
                  <p className="text-xs text-gray-500">Email address</p>
                  <p className="text-sm font-semibold text-gray-900">{me.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => openModalFor("password")}
                  className="flex w-full items-center gap-3 border-b border-gray-100 py-3 text-left"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">🔒</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">Password &amp; security</span>
                    <span className="block text-xs text-gray-500">Change your password</span>
                  </span>
                  <span className="text-gray-300">›</span>
                </button>
                <button
                  type="button"
                  onClick={() => openModalFor("privacy")}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">🛡</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">Privacy &amp; profile visibility</span>
                    <span className="block text-xs text-gray-500">
                      Currently {me.visibility === "private" ? "private — hidden from recruiters" : "public — visible to recruiters"}
                    </span>
                  </span>
                  <span className="text-gray-300">›</span>
                </button>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <a href="#" className="font-semibold text-primary hover:underline">Download my data</a>
                  <a href="#" className="font-semibold text-gray-400 hover:underline">Close account</a>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit Profile modal */}
      {openModal === "editProfile" && (
        <Modal title="Edit profile" onClose={() => setOpenModal(null)}>
          <form onSubmit={saveName} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
              <input
                id="fullName"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              Your target career role is set on the{" "}
              <Link to="/candidate/career-role" className="font-semibold text-primary hover:underline">Career Role</Link> page.
            </p>
            <Notice error={modalError} />
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </Modal>
      )}

      {/* About Me modal */}
      {openModal === "aboutMe" && (
        <Modal title="Edit About Me" onClose={() => setOpenModal(null)}>
          <form onSubmit={saveAbout} className="space-y-4">
            {[
              ["bio", "Bio", "textarea", "A few sentences about you"],
              ["careerInterests", "Career interests", "input", "e.g. Cloud infrastructure"],
              ["education", "Education", "input", "e.g. BSc in Computer Science"],
              ["technicalSkills", "Technical skills", "input", "Comma-separated, e.g. Docker, PostgreSQL, Git"],
              ["links", "Links", "input", "Comma-separated, e.g. github.com/you, linkedin.com/in/you"],
            ].map(([field, label, kind, placeholder]) => (
              <div key={field}>
                <label htmlFor={`about-${field}`} className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                {kind === "textarea" ? (
                  <textarea
                    id={`about-${field}`}
                    rows={4}
                    value={aboutDraft[field]}
                    onChange={(e) => setAboutDraft((a) => ({ ...a, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm resize-y"
                  />
                ) : (
                  <input
                    id={`about-${field}`}
                    value={aboutDraft[field]}
                    onChange={(e) => setAboutDraft((a) => ({ ...a, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                )}
                {field === "technicalSkills" && (
                  <p className="mt-1 text-xs text-gray-500">Self-reported. Verified skills come from assessments.</p>
                )}
              </div>
            ))}
            <Notice error={modalError} />
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </Modal>
      )}

      {/* Projects modal */}
      {openModal === "projects" && (
        <Modal title="Manage projects" onClose={() => setOpenModal(null)}>
          <ul className="divide-y divide-gray-100 mb-5">
            {projects.map((p) =>
              editingProject?.id === p.id ? (
                <li key={p.id} className="py-3">
                  <form onSubmit={saveProject} className="space-y-2">
                    <input
                      aria-label="Project name"
                      value={editingProject.name}
                      onChange={(e) => setEditingProject((x) => ({ ...x, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <input
                      aria-label="Project link"
                      value={editingProject.link}
                      onChange={(e) => setEditingProject((x) => ({ ...x, link: e.target.value }))}
                      placeholder="Link (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={saving} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Save</button>
                      <button type="button" onClick={() => setEditingProject(null)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">Cancel</button>
                    </div>
                  </form>
                </li>
              ) : (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    {p.link && <p className="break-all text-xs text-gray-500">{p.link}</p>}
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button onClick={() => { setModalError(""); setEditingProject({ id: p.id, name: p.name, link: p.link ?? "" }); }} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                    <button onClick={() => removeProject(p.id)} disabled={saving} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
                  </div>
                </li>
              ),
            )}
            {projects.length === 0 && <p className="py-3 text-sm text-gray-500">No projects yet.</p>}
          </ul>

          <form onSubmit={addProject} className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-700">Add a project</p>
            <input
              value={newProject.name}
              onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
              placeholder="Project name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={newProject.link}
              onChange={(e) => setNewProject((p) => ({ ...p, link: e.target.value }))}
              placeholder="Repository link (e.g. GitHub URL)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <Notice error={modalError} />
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              Add project
            </button>
          </form>
        </Modal>
      )}

      {/* Certifications modal */}
      {openModal === "certifications" && (
        <Modal title="Manage certifications" onClose={() => setOpenModal(null)}>
          <ul className="divide-y divide-gray-100 mb-5">
            {certifications.map((c) =>
              editingCertification?.id === c.id ? (
                <li key={c.id} className="py-3">
                  <form onSubmit={saveCertification} className="flex gap-2">
                    <input
                      aria-label="Certification name"
                      value={editingCertification.name}
                      onChange={(e) => setEditingCertification((x) => ({ ...x, name: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <button type="submit" disabled={saving} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Save</button>
                    <button type="button" onClick={() => setEditingCertification(null)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">Cancel</button>
                  </form>
                </li>
              ) : (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                  <div className="flex shrink-0 gap-3">
                    <button onClick={() => { setModalError(""); setEditingCertification({ id: c.id, name: c.name }); }} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                    <button onClick={() => removeCertification(c.id)} disabled={saving} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
                  </div>
                </li>
              ),
            )}
            {certifications.length === 0 && <p className="py-3 text-sm text-gray-500">No certifications yet.</p>}
          </ul>

          <form onSubmit={addCertification} className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-700">Add a certification</p>
            <input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Certification name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
            />
            <Notice error={modalError} />
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              Add certification
            </button>
          </form>
        </Modal>
      )}

      {/* Verification details modal */}
      {openModal === "verification" && (
        <Modal title="Verification details" onClose={() => setOpenModal(null)}>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              A skill is verified when you pass a Credify assessment for it. Once
              verified, it stays verified even if a later attempt scores lower.
            </p>
            <p>
              Each verified skill shows your best completed score for that skill.
              Self-reported technical skills are listed separately and aren&rsquo;t verified.
            </p>
          </div>
        </Modal>
      )}

      {/* Privacy modal */}
      {openModal === "privacy" && (
        <Modal title="Privacy & profile visibility" onClose={() => setOpenModal(null)}>
          <form onSubmit={saveVisibility} className="space-y-4">
            <p className="text-sm text-gray-600">
              Currently <span className="font-semibold text-gray-900">{me.visibility}</span>.
            </p>
            {[
              ["public", "Public", "Recruiters can find you in search and open your profile."],
              ["private", "Private", "You're hidden from recruiter search and your profile can't be opened by recruiters."],
            ].map(([value, label, desc]) => (
              <label key={value} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3">
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={visibilityDraft === value}
                  onChange={() => { setModalSuccess(""); setVisibilityDraft(value); }}
                  className="mt-1 accent-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-900">{label}</span>
                  <span className="block text-xs text-gray-500">{desc}</span>
                </span>
              </label>
            ))}
            <Notice error={modalError} success={modalSuccess} />
            <button
              type="submit"
              disabled={saving || visibilityDraft === me.visibility}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save visibility"}
            </button>
          </form>
        </Modal>
      )}

      {/* Password modal */}
      {openModal === "password" && (
        <Modal title="Password & security" onClose={() => setOpenModal(null)}>
          <form onSubmit={changePassword} className="space-y-4">
            {[
              ["currentPassword", "Current password", "current-password"],
              ["newPassword", "New password", "new-password"],
              ["confirmPassword", "Confirm new password", "new-password"],
            ].map(([field, label, autoComplete]) => (
              <div key={field}>
                <label htmlFor={field} className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                <input
                  id={field}
                  type="password"
                  autoComplete={autoComplete}
                  value={passwordForm[field]}
                  onChange={(e) => {
                    setModalError("");
                    setModalSuccess("");
                    setPasswordForm((f) => ({ ...f, [field]: e.target.value }));
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            ))}
            <p className="text-xs text-gray-500">At least {MIN_PASSWORD_LENGTH} characters.</p>
            <Notice error={modalError} success={modalSuccess} />
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Changing…" : "Change password"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
