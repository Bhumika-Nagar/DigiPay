import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridBackground from "../components/GridBackground";
import { Appbar } from "../components/Appbar";
import { Link } from "react-router-dom";
import { AUTH_BYPASS, DEMO_PAYMENTS, DEMO_USER } from "../config/devMode";
import { api } from "../lib/api";

const statusConfig = {
  pending: {
    label: "Pending",
    classes: "status-pill--pending",
    dot: "status-pill__dot--pending",
  },
  success: {
    label: "Success",
    classes: "status-pill--success",
    dot: "status-pill__dot--success",
  },
  completed: {
    label: "Success",
    classes: "status-pill--success",
    dot: "status-pill__dot--success",
  },
  failed: {
    label: "Failed",
    classes: "status-pill--failed",
    dot: "status-pill__dot--failed",
  },
  cancelled: {
    label: "Cancelled",
    classes: "status-pill--cancelled",
    dot: "status-pill__dot--cancelled",
  },
};

export default function ScheduledPayments() {
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (AUTH_BYPASS) {
      setPayments(DEMO_PAYMENTS);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/payment/ScheduledPayments");
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
    if (AUTH_BYPASS) {
      setUser(DEMO_USER);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/user/details");
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const cancelPayment = async (paymentId) => {
    if (AUTH_BYPASS) {
      setPayments((current) =>
        current.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: "cancelled" }
            : payment
        )
      );
      return;
    }

    try {
      await api.patch(`/payment/cancel/${paymentId}`, {});
      fetchPayments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GridBackground>
      <Appbar user={user} />

      <div className="app-layout app-layout--narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header"
        >
          <div>
            <p className="section-tag">Transfer calendar</p>
            <h1 className="page-header__title">Scheduled Payments</h1>
            <p className="page-header__body">
              {payments.length} payment{payments.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link to="/dashboard" className="button button--secondary">
            Back to Dashboard
          </Link>
        </motion.div>

        {loading && (
          <div className="loading-state">
            <svg className="loading-state__spinner" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {!loading && payments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state empty-state--panel"
          >
            <svg className="empty-state__icon empty-state__icon--large" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="empty-state__title">No scheduled payments</h3>
            <p className="empty-state__body">Schedule your first payment from the dashboard.</p>
            <Link to="/dashboard" className="button button--primary">
              Go to Dashboard
            </Link>
          </motion.div>
        )}

        <div className="payment-list">
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
                  className="payment-card"
                >
                  <div className="payment-card__row">
                    <div className="payment-card__identity">
                      <div className="payment-card__avatar">
                        {p.toUserId?.firstname?.[0]?.toUpperCase() || "?"}
                      </div>

                      <div>
                        <div className="payment-card__topline">
                          <span className="payment-card__amount">
                            {Number(p.amount).toLocaleString("en-IN")} INR
                          </span>
                          <span className={`status-pill ${status.classes}`}>
                            <span className={`status-pill__dot ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        <p className="payment-card__recipient">
                          To:{" "}
                          {p.toUserId
                            ? `${p.toUserId.firstname} ${p.toUserId.lastname}`
                            : "Unknown"}
                          {p.toUserId?.username && (
                            <span className="payment-card__handle"> @{p.toUserId.username}</span>
                          )}
                        </p>
                        <p className="payment-card__time">
                          <svg className="payment-card__time-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {p.executeAt ? new Date(p.executeAt).toLocaleString() : "No date"}
                        </p>
                      </div>
                    </div>

                    {p.status === "pending" && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => cancelPayment(p._id)} className="button button--danger">
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
