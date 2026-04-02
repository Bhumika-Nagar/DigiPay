import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import GridBackground from "../components/GridBackground";
import { Appbar } from "../components/Appbar";
import { Link } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  success: {
    label: "Success",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-surface-500/10 text-surface-400 border-surface-500/20",
    dot: "bg-surface-400",
  },
};

export default function ScheduledPayments() {
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/payment/ScheduledPayments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user/details", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const cancelPayment = async (paymentId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/payment/cancel/${paymentId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPayments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GridBackground>
      <Appbar user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Scheduled Payments</h1>
            <p className="text-sm text-surface-400 mt-1">
              {payments.length} payment{payments.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium text-surface-400 bg-surface-800/50 border border-surface-700/50 rounded-lg hover:bg-surface-800 hover:text-white transition-all"
          >
            Back to Dashboard
          </Link>
        </motion.div>

        
        {loading && (
          <div className="flex justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        
        {!loading && payments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center border border-surface-800/50"
          >
            <svg className="w-16 h-16 mx-auto mb-4 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-surface-300 mb-2">No scheduled payments</h3>
            <p className="text-sm text-surface-500 mb-6">Schedule your first payment from the dashboard</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 w-auto text-sm"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        )}

        
        <div className="space-y-3">
          <AnimatePresence>
            {payments.map((p, index) => {
              const status = statusConfig[p.status] || statusConfig.pending;
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card rounded-xl p-5 border border-surface-800/50 hover:border-surface-700/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-surface-600 to-surface-700 flex items-center justify-center text-white font-semibold text-sm border border-surface-600/50">
                        {p.toUserId?.firstname?.[0]?.toUpperCase() || "?"}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white">
                            {Number(p.amount).toLocaleString("en-IN")} INR
                          </span>
                          <span className={`status-badge border ${status.classes}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-surface-400 mt-0.5">
                          To:{" "}
                          {p.toUserId
                            ? `${p.toUserId.firstname} ${p.toUserId.lastname}`
                            : "Unknown"}
                          {p.toUserId?.username && (
                            <span className="text-surface-500"> @{p.toUserId.username}</span>
                          )}
                        </p>
                        <p className="text-xs text-surface-500 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {p.executeAt ? new Date(p.executeAt).toLocaleString() : "No date"}
                        </p>
                      </div>
                    </div>

                    {p.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => cancelPayment(p._id)}
                        className="btn-danger text-xs"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </GridBackground>
  );
}
