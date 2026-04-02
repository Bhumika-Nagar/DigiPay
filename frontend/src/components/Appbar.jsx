import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Appbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card border-b border-surface-800/50 sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              Digi<span className="text-gradient">Pay</span>
            </span>
          </Link>

          
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/scheduled"
              className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
            >
              Scheduled
            </Link>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-surface-500">Welcome back</p>
              <p className="text-sm font-semibold text-white">
                {user?.firstname || "User"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
              {user?.firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-surface-500 hover:text-red-400 transition-colors duration-200 ml-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
