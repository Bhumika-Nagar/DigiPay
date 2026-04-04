import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AUTH_BYPASS } from "../config/devMode";
import { logout } from "../lib/api";

export function Appbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!AUTH_BYPASS) {
      await logout();
      navigate("/signin");
      return;
    }

    navigate("/signin");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="topbar"
    >
      <div className="topbar__inner">
        <div className="topbar__row">
          <Link to="/" className="brand-mark">
            <div className="brand-mark__icon">
              <svg className="brand-mark__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="brand-mark__wordmark">
              Digi<span>Pay</span>
            </span>
          </Link>

          <div className="topbar__nav">
            <Link to="/dashboard" className="topbar__link">
              Dashboard
            </Link>
            <Link to="/scheduled" className="topbar__link">
              Scheduled
            </Link>
            <Link to="/signin" className="topbar__link">
              Sign in
            </Link>
          </div>

          <div className="topbar__actions">
            <div className="topbar__identity">
              <p className="topbar__eyebrow">Wallet owner</p>
              <p className="topbar__name">
                {user?.firstname ? `${user.firstname} ${user.lastname || ""}`.trim() : "Guest"}
              </p>
            </div>

            <div className="topbar__avatar">
              {user?.firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <button onClick={handleLogout} className="topbar__logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
