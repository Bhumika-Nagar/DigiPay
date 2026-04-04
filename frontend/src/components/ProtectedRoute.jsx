import { Navigate } from "react-router-dom";
import { AUTH_BYPASS } from "../config/devMode";
import { getStoredToken } from "../lib/api";

export default function ProtectedRoute({ children }) {
  if (AUTH_BYPASS) {
    return children;
  }

  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/signin" />;
  }

  return children;
}
