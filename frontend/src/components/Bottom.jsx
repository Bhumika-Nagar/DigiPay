import { Link } from "react-router-dom";

export function Bottom({ label, buttonText, to }) {
  return (
    <div className="text-sm text-center mt-6 text-surface-400">
      {label}{" "}
      <Link
        to={to}
        className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
      >
        {buttonText}
      </Link>
    </div>
  );
}
