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

function emptyQuestion() {
  return {
    id: Date.now() + Math.random(),
    type: "MCQ",
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}

// TODO (backend step): replace with the real assessment + question bank from the API.
const initialAssessment = {
  title: "Java Programming",
  description: "Add, edit and order the question bank for this assessment.",
};

const initialQuestions = [
  {
    id: 1,
    type: "MCQ",
    prompt:
      "Which concept allows a class to acquire properties and methods from another class?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correctIndex: 1,
  },
  {
    id: 2,
    type: "MCQ",
    prompt: "What keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctIndex: 1,
  },
];

export default function AdminAssessmentEditorPage() {
  const [assessment, setAssessment] = useState(initialAssessment);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(initialAssessment);

  const [questions, setQuestions] = useState(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState(null); // { index, data } | null
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  const [passingScore, setPassingScore] = useState(50);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [confirmingPublish, setConfirmingPublish] = useState(false);
  const [publishedMessage, setPublishedMessage] = useState("");

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

  // ---- Assessment title/description ----
  function openTitleEdit() {
    setTitleDraft(assessment);
    setEditingTitle(true);
  }

  function saveTitle(e) {
    e.preventDefault();
    setAssessment(titleDraft);
    setEditingTitle(false);
  }

  // ---- Questions ----
  function addQuestion() {
    const q = emptyQuestion();
    setQuestions((prev) => [...prev, q]);
    setEditingQuestion({ index: questions.length, data: q });
  }

  function openEditQuestion(index) {
    setEditingQuestion({ index, data: { ...questions[index] } });
  }

  function updateEditingField(field, value) {
    setEditingQuestion((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
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
      if (correctIndex >= options.length) correctIndex = 0;
      return { ...prev, data: { ...prev.data, options, correctIndex } };
    });
  }

  function saveQuestion(e) {
    e.preventDefault();
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === editingQuestion.index ? editingQuestion.data : q,
      ),
    );
    setEditingQuestion(null);
  }

  function confirmDeleteQuestion() {
    setQuestions((prev) => prev.filter((q) => q.id !== deletingQuestionId));
    setDeletingQuestionId(null);
  }

  // ---- Save draft / publish ----
  function saveDraft() {
    // TODO (backend step): PATCH the assessment + questions to the API as a draft.
    setDraftSavedAt(new Date().toLocaleTimeString());
  }

  function publishAssessment() {
    // TODO (backend step): POST to publish the assessment for candidates.
    setConfirmingPublish(false);
    setPublishedMessage("Assessment published. It is now live for candidates.");
    setTimeout(() => setPublishedMessage(""), 4000);
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
          </div>
        </header>

        <main className="p-10">
          {publishedMessage && (
            <div className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
              {publishedMessage}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
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
                      onClick={() => setDeletingQuestionId(q.id)}
                      className="text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-2">
                  {q.prompt || "Untitled question"}
                </p>
                {q.type === "MCQ" ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {q.options.map((opt, i) => (
                      <span
                        key={i}
                        className={
                          i === q.correctIndex
                            ? "text-green-700 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {i === q.correctIndex ? "✓ " : ""}
                        {String.fromCharCode(65 + i)}. {opt || "(empty)"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    {q.type === "Short answer"
                      ? "Candidate types a brief written answer."
                      : "Candidate types a longer, free-form written answer."}
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-600">
                    Passing score
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <span className="text-sm text-slate-600">%</span>
                </div>
                {draftSavedAt && (
                  <span className="text-xs text-slate-500">
                    Draft saved at {draftSavedAt}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={saveDraft}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Save draft
                </button>
                <button
                  onClick={() => setConfirmingPublish(true)}
                  className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
                >
                  Publish assessment
                </button>
              </div>
            </div>
          </div>
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
            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit question modal */}
      {editingQuestion && (
        <Modal
          title={`Edit question ${editingQuestion.index + 1}`}
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
                value={editingQuestion.data.prompt}
                onChange={(e) => updateEditingField("prompt", e.target.value)}
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
                  Select the radio button next to the correct answer.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {editingQuestion.data.type === "Short answer"
                  ? "Candidates will type a brief written answer. No options needed."
                  : "Candidates will type a longer, free-form written answer. No options needed."}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Save question
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
            "{deletingQuestion.prompt || "Untitled question"}"
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingQuestionId(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteQuestion}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Delete question
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
            and a passing score of {passingScore}%? Once published, it becomes
            visible to candidates.
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
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              Yes, publish
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
