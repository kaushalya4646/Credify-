// src/pages/FeedbackPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "General feedback",
  "Bug report",
  "Feature request",
  "Assessment experience",
  "Something else",
];

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO (backend step): POST { category, rating, message } to the feedback API.
    setSubmitted(true);
  }

  function handleReset() {
    setCategory(CATEGORIES[0]);
    setRating(0);
    setMessage("");
    setSubmitted(false);
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

      <main className="max-w-xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Thanks for your feedback!</h1>
            <p className="text-sm text-slate-500">
              We read every message. It helps us make Credify better for everyone.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3 mb-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">Give feedback about Credify</h1>
              <p className="text-sm text-slate-500">
                Tell us what's working, what isn't, or what you'd like to see next.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  What's this about?
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="text-2xl"
                    >
                      <span className={n <= rating ? "text-amber-400" : "text-slate-200"}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  placeholder="Tell us more..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
              >
                Send feedback
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}