import { Link } from "react-router-dom";

export function Bottom({ label, buttonText, to }) {
  return (
    <div className="auth-switch">
      <span>{label}</span>{" "}
      <Link to={to} className="auth-switch__link">
        {buttonText}
      </Link>
    </div>
  );
}
