import { Link } from "react-router-dom"


export function Bottom({ label, buttonText, to }) {
  return (
    <div className="py-2 text-sm flex justify-center mt-4">
      <div>{label}</div>

      <Link
        to={to}
        className="underline pl-1 cursor-pointer text-blue-600"
      >
        {buttonText}
      </Link>
    </div>
  );
}