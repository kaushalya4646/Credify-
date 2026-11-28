import { useState } from "react";
import { api } from "../api/client";

// Save / unsave a candidate in the recruiter's saved list. `saved` comes from
// the API; `onChange(saved)` reports the new state after the server confirms it.
export default function SaveCandidateButton({ candidateUserId, saved, onChange, className = "" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      if (saved) await api.delete(`/api/saved-candidates/${candidateUserId}`);
      else await api.put(`/api/saved-candidates/${candidateUserId}`);
      onChange(!saved);
    } catch (err) {
      setError(err.message || "Could not update saved candidates.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={saved}
        title={saved ? "Remove from saved candidates" : "Save candidate"}
        className={`${className} disabled:opacity-60 ${
          saved
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-blue-50 border border-blue-100 text-primary"
        }`}
      >
        {busy ? "Saving…" : saved ? "✓ Saved" : "Save candidate"}
      </button>
      {error && <span role="alert" className="mt-1 text-xs text-red-600">{error}</span>}
    </span>
  );
}
