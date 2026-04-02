import { Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/signin" />;
  }
}