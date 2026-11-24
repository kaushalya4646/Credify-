import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  CANDIDATE: "/candidate/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard",
};

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // still checking localStorage on startup, render nothing briefly
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(role) ? role : role ? [role] : null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this page — send them to their own dashboard instead of an error page.
    return <Navigate to={dashboardByRole[user.role] || "/"} replace />;
  }

  return children;
}