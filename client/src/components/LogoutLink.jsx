import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LogoutLink({ className }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Log out
    </button>
  );
}