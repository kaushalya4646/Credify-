import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import LogoutLink from "../components/LogoutLink";
import { api } from "../api/client";

const navItems = [
  { label: "Dashboard", to: "/candidate/dashboard" },
  { label: "Career Role", to: "/candidate/career-role" },
  { label: "Assessments", to: "/candidate/assessments" },
  { label: "Skill Gaps", to: "/candidate/skill-gaps" },
  { label: "My Profile", to: "/candidate/profile" },
];

export default function CareerRoleDetailsPage() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [roleData, verData, attData, selectedData] = await Promise.all([
          api.get(`/api/career-roles/${id}`),
          api.get("/api/skill-verifications/me"),
          api.get("/api/assessments/attempts/me"),
          api.get("/api/career-roles/me/selected"),
        ]);
        setRole(roleData);
        setVerifications(verData || []);
        setAttempts(attData || []);
        setSelectedRoleId(selectedData ? selectedData.id : null);
      } catch (err) {
        console.error("Failed to load career role details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSelect() {
    setSelecting(true);
    try {
      await api.put("/api/career-roles/me/select", { careerRoleId: id });
      setSelectedRoleId(id);
    } catch (err) {
      console.error("Failed to select career role:", err);
    } finally {
      setSelecting(false);
    }
  }

  // For each required skill, figure out the candidate's real status.
  function statusFor(skillId) {
    // A failed attempt also leaves a "Not Verified" record, so check the status.
    const verified = verifications.some(
      (v) => v.skillId === skillId && v.status === "Verified",
    );
    if (verified) return "Verified";
    const attempted = attempts.some((a) => a.assessment?.skillId === skillId);
    if (attempted) return "In Progress";
    return "Not started";
  }

  const isSelected = selectedRoleId === id;

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
          <Link to="/candidate/career-role" className="text-sm font-medium text-primary hover:underline">
            ← Back to career roles
          </Link>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading…</p>
          ) : !role ? (
            <p className="py-10 text-center text-sm text-gray-500">Career role not found.</p>
          ) : (
            <>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{role.name}</h1>
                    {role.category && (
                      <span className="mt-1 inline-block rounded-full bg-[#EAF1FF] px-3 py-1 text-xs font-semibold text-primary">
                        {role.category}
                      </span>
                    )}
                    <p className="mt-3 max-w-2xl text-sm text-gray-600">{role.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={isSelected || selecting}
                    className={`min-h-11 rounded-lg px-5 text-sm font-semibold ${
                      isSelected
                        ? "cursor-default bg-[#DCFCE7] text-[#15803D]"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isSelected ? "✓ Selected" : selecting ? "Selecting…" : "Select this role"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Required skills ({role.requiredSkills.length})
                </h2>
                <div className="space-y-3">
                  {role.requiredSkills.map((s) => {
                    const status = statusFor(s.skillId);
                    const badgeClass =
                      status === "Verified"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : status === "In Progress"
                        ? "bg-[#FEF3C7] text-[#B45309]"
                        : "bg-gray-100 text-gray-500";
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
                          {status}
                        </span>
                      </div>
                    );
                  })}
                  {role.requiredSkills.length === 0 && (
                    <p className="text-sm text-gray-500">No required skills set for this role yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}