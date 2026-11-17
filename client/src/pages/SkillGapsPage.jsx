import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Assessments", to: "/candidate/assessments" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "My Profile", to: "/candidate/profile" },
];

export default function SkillGapsPage() {
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const selected = await api.get("/api/career-roles/me/selected");
        setRole(selected);
        if (selected) {
          const [verData, attData] = await Promise.all([
            api.get("/api/skill-verifications/me"),
            api.get("/api/assessments/attempts/me"),
          ]);
          setVerifications(verData || []);
          setAttempts(attData || []);
        }
      } catch (err) {
        console.error("Failed to load skill gaps:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function statusFor(skillId) {
    const verified = verifications.some((v) => v.skillId === skillId);
    if (verified) return "verified";
    const attempted = attempts.some((a) => a.assessment?.skillId === skillId);
    if (attempted) return "in-progress";
    return "missing";
  }

  const required = role?.requiredSkills || [];
  const withStatus = required.map((s) => ({ ...s, status: statusFor(s.skillId) }));

  const matched = withStatus.filter((s) => s.status === "verified");
  const inProgress = withStatus.filter((s) => s.status === "in-progress");
  const missing = withStatus.filter((s) => s.status === "missing");

  const matchPct = required.length
    ? Math.round((matched.length / required.length) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 px-2">
          <span className="text-xl font-bold tracking-tight text-primary">Credify</span>
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
        <div className="mt-auto">
          <LogoutLink className="flex w-full min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-gray-50" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <main className="flex-1 space-y-6 px-6 py-8 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Skill Gap Analysis</h1>
            <p className="text-sm text-gray-500">
              See how your verified skills compare to your target career role.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading…</p>
          ) : !role ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-base font-medium text-gray-900">
                You haven't selected a career role yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Choose a target role to see how your skills measure up.
              </p>
              <Link
                to="/candidate/career-role"
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Choose a Career Role
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target role</p>
                    <h2 className="text-lg font-bold text-gray-900">{role.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Overall match</p>
                    <p className="text-2xl font-bold text-primary">{matchPct}%</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-[#DCFCE7] py-3">
                    <p className="text-lg font-bold text-[#15803D]">{matched.length}</p>
                    <p className="text-xs text-[#15803D]">Matched</p>
                  </div>
                  <div className="rounded-lg bg-[#FEF3C7] py-3">
                    <p className="text-lg font-bold text-[#B45309]">{inProgress.length}</p>
                    <p className="text-xs text-[#B45309]">In Progress</p>
                  </div>
                  <div className="rounded-lg bg-gray-100 py-3">
                    <p className="text-lg font-bold text-gray-600">{missing.length}</p>
                    <p className="text-xs text-gray-600">Missing</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Skill breakdown</h2>
                <div className="space-y-3">
                  {withStatus.map((s) => {
                    const badgeClass =
                      s.status === "verified"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : s.status === "in-progress"
                        ? "bg-[#FEF3C7] text-[#B45309]"
                        : "bg-gray-100 text-gray-500";
                    const label =
                      s.status === "verified"
                        ? "Verified"
                        : s.status === "in-progress"
                        ? "In Progress"
                        : "Missing";
                    return (
                      <div
                        key={s.skillId}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-500">Required level: {s.requiredLevel}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(missing.length > 0 || inProgress.length > 0) && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Recommended actions</h2>
                  <div className="space-y-3">
                    {[...missing, ...inProgress].map((s) => (
                      <div
                        key={s.skillId}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <p className="text-sm text-gray-700">
                          {s.status === "missing"
                            ? `Take an assessment to start verifying ${s.name}`
                            : `Finish an assessment to verify ${s.name}`}
                        </p>
                        <Link
                          to="/candidate/assessments"
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Go to assessments →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}