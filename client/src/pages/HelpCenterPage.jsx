import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const faqCategories = [
  {
    title: "Getting started",
    desc: "Creating your account, choosing a career role and setting up your profile.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </svg>
    ),
  },
  {
    title: "Assessments",
    desc: "Taking a skill assessment, understanding your score and retaking a test.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    title: "Verification",
    desc: "How skills get verified, badges and what recruiters see on your profile.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
      </svg>
    ),
  },
  {
    title: "For recruiters",
    desc: "Finding candidates, saving profiles and posting job vacancies.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: "Account & billing",
    desc: "Managing your account details, email preferences and subscription.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    title: "Privacy & security",
    desc: "How your data is used, stored and kept secure on Credify.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
    ),
  },
];

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const visibleCategories = faqCategories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      c.desc.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between lg:px-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <Link to="/" className="flex items-center gap-2">
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
          <span className="text-xl font-bold text-primary">Credify</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.5 2.5 0 014.8 1c0 1.5-2.3 1.8-2.3 3.3" />
              <circle cx="12" cy="17" r="0.6" fill="#2563eb" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            How can we help?
          </h1>
          <p className="text-sm text-slate-500">
            Search our help topics or browse a category below.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full border-none text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleCategories.map((c) => (
            <button
              key={c.title}
              className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-primary transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                {c.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
              <p className="text-sm text-slate-500">{c.desc}</p>
            </button>
          ))}
          {visibleCategories.length === 0 && (
            <p className="col-span-2 text-center text-sm text-slate-500 py-8">
              No help topics match &ldquo;{search}&rdquo;.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center text-sm font-medium text-primary">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy policy
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/terms-of-service" className="hover:underline">
            Terms of service
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/about-us" className="hover:underline">
            About us
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-slate-900 mb-1">
            Still need help?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Our support team usually replies within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-flex px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            Contact support
          </Link>
        </div>
      </main>
    </div>
  );
}
