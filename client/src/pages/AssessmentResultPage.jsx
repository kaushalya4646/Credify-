import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "My Profile", to: "/candidate/profile" },
];

const assessmentSubnav = [
  { label: "Technical assessments", to: "/candidate/assessments" },
  // No results index page: link to the list, but highlight on any result page.
  {
    label: "Assessment results",
    to: "/candidate/assessments",
    activePrefix: "/candidate/assessments/results/",
  },
];

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

function ScoreRing({ pct, correct, total }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-[112px] w-[112px]">
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="#FCA5A5"
          strokeWidth="10"
        />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="#16A34A"
          strokeWidth="10"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{pct}%</span>
        {correct != null && total != null && (
          <span className="text-[11px] text-gray-500">
            {correct} of {total} correct
          </span>
        )}
      </div>
    </div>
  );
}

export default function AssessmentResultPage() {
  const { pathname } = useLocation();
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [attemptData, verifications] = await Promise.all([
          api.get(`/api/assessments/attempts/${attemptId}`),
          api.get("/api/skill-verifications/me"),
        ]);
        setAttempt(attemptData);
        const skillId = attemptData.assessment?.skill?.id;
        setIsVerified(
          (verifications || []).some(
            (v) => v.skillId === skillId && v.status === "Verified",
          ),
        );
      } catch (err) {
        console.error("Failed to load assessment result:", err);
        setError(err.message || "Could not load this result.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attemptId]);

  const assessmentTitle = attempt?.assessment?.title;
  const skillName = attempt?.assessment?.skill?.name;
  const score = attempt?.score ?? 0;
  const correct = attempt?.correctCount;
  const total = attempt?.totalQuestions;
  const hasCounts = correct != null && total != null;
  const incorrect = hasCounts ? total - correct : null;

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
          <Link
            to={navItems[0].to}
            className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {navItems[0].label}
          </Link>
          <Link
            to={navItems[1].to}
            className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {navItems[1].label}
          </Link>

          <div className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary">
            Assessments
          </div>
          <div className="ml-3 space-y-1 border-l border-gray-200 pl-3">
            {assessmentSubnav.map((item) => {
              const active = item.activePrefix
                ? pathname.startsWith(item.activePrefix)
                : pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm ${
                    active
                      ? "font-semibold text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-gray-300"}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {navItems.slice(2).map((item) => {
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
            <h1 className="text-xl font-semibold text-gray-900">
              Assessment result
            </h1>
            {attempt && (
              <p className="text-sm text-gray-500">
                {assessmentTitle}
                {skillName && <> &middot; {skillName}</>}
              </p>
            )}
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
                  CS
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  Chethina Sri
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
            <p className="py-10 text-center text-sm text-gray-500">
              Loading result…
            </p>
          )}

          {!loading && error && (
            <p className="py-10 text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && attempt && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-2xl text-primary">
                    ☕
                  </span>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {score}%
                    </p>
                    <p className="text-sm text-gray-500">Overall score</p>
                  </div>
                </div>
                {isVerified ? (
                  <span className="rounded-full bg-[#E8F5EE] px-3 py-1 text-sm font-semibold text-[#15803D]">
                    Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    Not Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-green-500" />
                    <span className="text-gray-600">Correct</span>
                    <span className="ml-6 font-semibold text-gray-900">
                      {hasCounts ? correct : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-red-500" />
                    <span className="text-gray-600">Incorrect</span>
                    <span className="ml-6 font-semibold text-gray-900">
                      {hasCounts ? incorrect : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-gray-200" />
                    <span className="text-gray-600">Total</span>
                    <span className="ml-6 font-semibold text-gray-900">
                      {hasCounts ? total : "—"}
                    </span>
                  </div>
                </div>
                <ScoreRing pct={score} correct={correct} total={total} />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/candidate/profile"
              className="flex min-h-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View skill profile
            </Link>
            <Link
              to="/candidate/assessments"
              className="flex min-h-12 items-center justify-center gap-1 rounded-lg border border-primary text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Explore recommended assessments ↗
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
