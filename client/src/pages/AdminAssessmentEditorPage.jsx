import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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
          const active = location.pathname.startsWith(item.path);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const QUESTION_TYPES = ["MCQ", "Short answer", "Long answer"];

// Editing shape for the modal: MCQ answers are picked by position in the form
// but stored by text, which is what the backend expects.
function emptyQuestionForm() {
  return { id: null, type: "MCQ", questionText: "", options: ["", "", "", ""], correctIndex: 0 };
}

function formFromQuestion(q) {
  const options = Array.isArray(q.options) && q.options.length ? [...q.options] : ["", "", "", ""];
  const correctIndex = Math.max(0, options.indexOf(q.correctAnswer));
  return { id: q.id, type: q.type, questionText: q.questionText, options, correctIndex };
}

// Builds the API body and checks it the same way the backend does.
function questionBody(form) {
  const questionText = form.questionText.trim();
  if (!questionText) return { error: "Write the question first." };
  if (form.type !== "MCQ") {
    return { body: { questionText, type: form.type, options: null, correctAnswer: null } };
  }
  const correct = form.options[form.correctIndex]?.trim();
  if (!correct) return { error: "The option marked as correct can't be empty." };
  const options = form.options.map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) return { error: "Add at least two answer options." };
  if (new Set(options).size !== options.length) {
    return { error: "Each answer option must be different." };
  }
  return { body: { questionText, type: "MCQ", options, correctAnswer: correct } };
}

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}

export default function AdminAssessmentEditorPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState({ title: "Assessment", description: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState({ title: "", description: "" });
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // { index, data } | null
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);
  const [passingScore, setPassingScore] = useState("");
  const [savedPassingScore, setSavedPassingScore] = useState(null);
  const [confirmingPublish, setConfirmingPublish] = useState(false);

  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [banner, setBanner] = useState(null); // { kind: "success" | "error", text }

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

  function toggleHeaderMenu(name) {
    setOpenMenu((m) => (m === name ? null : name));
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await api.get(`/api/assessments/${id}`);
        setAssessment(data);
        setQuestions(data.questions || []);
        setPassingScore(String(data.passingScore));
        setSavedPassingScore(data.passingScore);
      } catch (err) {
        console.error("Failed to load assessment:", err);
        setLoadError(err.message || "Could not load this assessment.");
        setAssessment({ title: "Assessment not found", description: "" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function showBanner(kind, text) {
    setBanner({ kind, text });
    if (kind === "success") setTimeout(() => setBanner(null), 4000);
  }

  // Saves only the fields given; keeps local state in step with the server.
  async function saveAssessment(fields) {
    const updated = await api.put(`/api/assessments/${id}`, fields);
    setAssessment((prev) => ({ ...prev, ...updated }));
    if (updated.passingScore != null) {
      setSavedPassingScore(updated.passingScore);
      setPassingScore(String(updated.passingScore));
    }
    return updated;
  }

  // ---- Assessment title/description ----
  function openTitleEdit() {
    setModalError("");
    setTitleDraft({ title: assessment.title, description: assessment.description ?? "" });
    setEditingTitle(true);
  }

  async function saveTitle(e) {
    e.preventDefault();
    if (!titleDraft.title.trim()) return setModalError("Enter a title.");
    setSaving(true);
    setModalError("");
    try {
      await saveAssessment({
        title: titleDraft.title.trim(),
        description: titleDraft.description.trim() || null,
      });
      setEditingTitle(false);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---- Questions ----
  function addQuestion() {
    setModalError("");
    setEditingQuestion({ index: questions.length, data: emptyQuestionForm() });
  }

  function openEditQuestion(index) {
    setModalError("");
    setEditingQuestion({ index, data: formFromQuestion(questions[index]) });
  }

  function updateEditingField(field, value) {
    setEditingQuestion((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  }

  function updateEditingOption(i, value) {
    setEditingQuestion((prev) => {
      const options = [...prev.data.options];
      options[i] = value;
      return { ...prev, data: { ...prev.data, options } };
    });
  }

  function addOption() {
    setEditingQuestion((prev) => ({
      ...prev,
      data: { ...prev.data, options: [...prev.data.options, ""] },
    }));
  }

  function removeOption(i) {
    setEditingQuestion((prev) => {
      const options = prev.data.options.filter((_, idx) => idx !== i);
      let correctIndex = prev.data.correctIndex;
      if (i < correctIndex) correctIndex -= 1;
      else if (i === correctIndex || correctIndex >= options.length) correctIndex = 0;
      return { ...prev, data: { ...prev.data, options, correctIndex } };
    });
  }

  async function saveQuestion(e) {
    e.preventDefault();
    const { body, error } = questionBody(editingQuestion.data);
    if (error) return setModalError(error);
    setSaving(true);
    setModalError("");
    try {
      const qid = editingQuestion.data.id;
      if (qid) {
        const updated = await api.put(`/api/assessments/${id}/questions/${qid}`, body);
        // Replace in place so the list order doesn't jump around.
        setQuestions((prev) => prev.map((q) => (q.id === qid ? updated : q)));
      } else {
        const created = await api.post(`/api/assessments/${id}/questions`, body);
        setQuestions((prev) => [...prev, created]);
      }
      setEditingQuestion(null);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteQuestion() {
    setSaving(true);
    setModalError("");
    try {
      await api.delete(`/api/assessments/${id}/questions/${deletingQuestionId}`);
      setQuestions((prev) => prev.filter((q) => q.id !== deletingQuestionId));
      setDeletingQuestionId(null);
    } catch (err) {
      // Shows the backend's 409 messages (last question of an Active
      // assessment, or a question candidates have already answered).
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---- Passing score / save draft / publish ----
  function parsedPassingScore() {
    const n = Number(passingScore);
    return passingScore !== "" && Number.isInteger(n) && n >= 0 && n <= 100 ? n : null;
  }

  async function savePassingScore() {
    const n = parsedPassingScore();
    if (n == null) {
      showBanner("error", "Passing score must be a whole number from 0 to 100.");
      return;
    }
    if (n === savedPassingScore) return;
    try {
      await saveAssessment({ passingScore: n });
      showBanner("success", `Passing score saved (${n}%).`);
    } catch (err) {
      showBanner("error", err.message);
    }
  }

  async function saveDraft() {
    const n = parsedPassingScore();
    if (n == null) {
      showBanner("error", "Passing score must be a whole number from 0 to 100.");
      return;
    }
    setSaving(true);
    try {
      await saveAssessment({ status: "Draft", passingScore: n });
      showBanner("success", `Saved as draft at ${new Date().toLocaleTimeString()}. Candidates can't see it.`);
    } catch (err) {
      showBanner("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  const mcqCount = questions.filter((q) => q.type === "MCQ").length;

  function requestPublish() {
    if (parsedPassingScore() == null) {
      showBanner("error", "Passing score must be a whole number from 0 to 100.");
      return;
    }
    if (questions.length === 0) {
      showBanner("error", "Add at least one question before publishing.");
      return;
    }
    // Only MCQs are auto-graded, so an all-written assessment couldn't be scored.
    if (mcqCount === 0) {
      showBanner("error", "Add at least one multiple-choice question before publishing — written answers aren't auto-graded, so there'd be nothing to score.");
      return;
    }
    setConfirmingPublish(true);
  }

  async function publishAssessment() {
    setSaving(true);
    try {
      await saveAssessment({ status: "Active", passingScore: parsedPassingScore() });
      setConfirmingPublish(false);
      showBanner("success", "Assessment published. It is now live for candidates.");
    } catch (err) {
      setConfirmingPublish(false);
      showBanner("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  const deletingQuestion = questions.find((q) => q.id === deletingQuestionId);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-10 py-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {assessment.title} — Questions
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {assessment.description}
              </p>
            </div>
            <button
              onClick={openTitleEdit}
              className="ml-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Edit title
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={addQuestion}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Add question
            </button>
            <div className="flex items-center gap-4" ref={menuRef}>
              {/* Help dropdown */}
              <div className="relative">
                <button
                  aria-label="Help"
                  onClick={() => toggleHeaderMenu("help")}
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
                  onClick={() => toggleHeaderMenu("notifications")}
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
                  onClick={() => toggleHeaderMenu("profile")}
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
                    <LogoutLink className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10">
          <Link
            to="/admin/assessments"
            className="mb-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            ← Back to assessments
          </Link>

          {banner && (
            <div
              className={`mb-5 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
                banner.kind === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <span>{banner.text}</span>
              <button onClick={() => setBanner(null)} aria-label="Dismiss">
                ✕
              </button>
            </div>
          )}

          {loading && (
            <p className="py-10 text-center text-sm text-slate-500">Loading assessment…</p>
          )}

          {!loading && loadError && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="font-semibold text-slate-900">{loadError}</p>
              <Link
                to="/admin/assessments"
                className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Back to assessments
              </Link>
            </div>
          )}

          {!loading && !loadError && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold ${
                    assessment.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : assessment.status === "Draft"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {assessment.status}
                </span>
                <span>{assessment.skill?.name}</span>
                <span>·</span>
                <span>{assessment.difficulty}</span>
                <span>·</span>
                <span>
                  {questions.length} question{questions.length === 1 ? "" : "s"} ({mcqCount} scored)
                </span>
              </div>

              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">
                      QUESTION {index + 1}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-xs font-semibold">
                        {q.type}
                      </span>
                      <button
                        onClick={() => openEditQuestion(index)}
                        className="text-primary text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setModalError("");
                          setDeletingQuestionId(q.id);
                        }}
                        className="text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-2">
                    {q.questionText}
                  </p>
                  {q.type === "MCQ" ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {(q.options || []).map((opt, i) => {
                        const correct = opt === q.correctAnswer;
                        return (
                          <span
                            key={i}
                            className={correct ? "text-green-700 font-semibold" : "text-slate-500"}
                          >
                            {correct ? "✓ " : ""}
                            {String.fromCharCode(65 + i)}. {opt}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {q.type === "Short answer"
                        ? "Candidate types a brief written answer. Saved, not auto-graded."
                        : "Candidate types a longer, free-form written answer. Saved, not auto-graded."}
                    </p>
                  )}
                </div>
              ))}

              {questions.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">
                  No questions yet. Add one to get started.
                </p>
              )}

              <button
                onClick={addQuestion}
                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-400 hover:text-primary hover:border-primary"
              >
                + Add another question
              </button>

              <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label htmlFor="passingScore" className="text-sm text-slate-600">
                    Passing score
                  </label>
                  <input
                    id="passingScore"
                    type="number"
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    onBlur={savePassingScore}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    className="w-20 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <span className="text-sm text-slate-600">%</span>
                  <span className="text-xs text-slate-400">Based on multiple-choice questions only</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveDraft}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-60"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={requestPublish}
                    disabled={saving}
                    className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-60"
                  >
                    {assessment.status === "Active" ? "Update published assessment" : "Publish assessment"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit assessment title/description modal */}
      {editingTitle && (
        <Modal title="Edit assessment" onClose={() => setEditingTitle(false)}>
          <form onSubmit={saveTitle} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Title
              </label>
              <input
                value={titleDraft.title}
                onChange={(e) =>
                  setTitleDraft((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={titleDraft.description}
                onChange={(e) =>
                  setTitleDraft((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <ErrorText>{modalError}</ErrorText>
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </Modal>
      )}

      {/* Add / edit question modal */}
      {editingQuestion && (
        <Modal
          title={
            editingQuestion.data.id
              ? `Edit question ${editingQuestion.index + 1}`
              : `New question ${editingQuestion.index + 1}`
          }
          onClose={() => setEditingQuestion(null)}
        >
          <form onSubmit={saveQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Question type
              </label>
              <select
                value={editingQuestion.data.type}
                onChange={(e) => updateEditingField("type", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Question
              </label>
              <textarea
                value={editingQuestion.data.questionText}
                onChange={(e) => updateEditingField("questionText", e.target.value)}
                rows={3}
                placeholder="Write the question"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
              />
            </div>

            {editingQuestion.data.type === "MCQ" ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Answer options
                </label>
                <div className="space-y-2">
                  {editingQuestion.data.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={editingQuestion.data.correctIndex === i}
                        onChange={() => updateEditingField("correctIndex", i)}
                        title="Mark as correct answer"
                        aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateEditingOption(i, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                      {editingQuestion.data.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(i)}
                          className="text-red-600 text-xs font-medium px-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 text-xs font-medium text-primary"
                >
                  + Add option
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Select the radio button next to the correct answer. Empty options are left out.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {editingQuestion.data.type === "Short answer"
                  ? "Candidates will type a brief written answer. No options needed — it's saved but not auto-graded."
                  : "Candidates will type a longer, free-form written answer. No options needed — it's saved but not auto-graded."}
              </p>
            )}

            <ErrorText>{modalError}</ErrorText>
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save question"}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete question confirmation */}
      {deletingQuestion && (
        <Modal
          title="Delete question"
          onClose={() => setDeletingQuestionId(null)}
        >
          <p className="text-sm text-slate-600 mb-5">
            Are you sure you want to delete this question? This cannot be
            undone.
          </p>
          <p className="text-sm font-medium text-slate-900 mb-5">
            "{deletingQuestion.questionText}"
          </p>
          <div className="mb-5">
            <ErrorText>{modalError}</ErrorText>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingQuestionId(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              {modalError ? "Close" : "Cancel"}
            </button>
            <button
              onClick={confirmDeleteQuestion}
              disabled={saving || Boolean(modalError)}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? "Deleting…" : "Delete question"}
            </button>
          </div>
        </Modal>
      )}

      {/* Publish confirmation */}
      {confirmingPublish && (
        <Modal
          title="Publish assessment"
          onClose={() => setConfirmingPublish(false)}
        >
          <p className="text-sm text-slate-600 mb-5">
            Publish{" "}
            <span className="font-semibold text-slate-900">
              {assessment.title}
            </span>{" "}
            with {questions.length} question{questions.length === 1 ? "" : "s"}{" "}
            ({mcqCount} scored) and a passing score of {passingScore}%? Once
            published, it becomes visible to candidates.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmingPublish(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={publishAssessment}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Publishing…" : "Yes, publish"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
