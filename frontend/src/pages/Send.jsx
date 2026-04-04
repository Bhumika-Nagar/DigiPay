import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";
import Button from "../components/Button";
import { AUTH_BYPASS } from "../config/devMode";
import { api } from "../lib/api";

export default function Send() {
  const [amount, setAmount] = useState("");
  const [executeAt, setExecuteAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  async function handleSchedule() {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!executeAt) {
      setError("Select date and time");
      return;
    }
    setError("");
    setLoading(true);
    if (AUTH_BYPASS) {
      window.setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 350);
      return;
    }

    try {
      await api.post(
        "/payment/schedule",
        {
          toUserId: id,
          amount: Number(amount),
          executeAt: new Date(executeAt).toISOString(),
        }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Scheduling failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer() {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setLoading(true);
    if (AUTH_BYPASS) {
      window.setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 350);
      return;
    }

    try {
      await api.post(
        "/account/transfer",
        {
          to: id,
          amount: Number(amount),
        }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <GridBackground>
        <div className="flow-layout flow-layout--centered">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="success-card"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="success-card__icon"
            >
              <svg className="success-card__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </motion.div>

            <h2 className="success-card__title">
              {executeAt ? "Payment Scheduled!" : "Transfer Successful!"}
            </h2>
            <p className="success-card__body">
              {executeAt
                ? `${Number(amount).toLocaleString("en-IN")} INR scheduled to ${name}`
                : `${Number(amount).toLocaleString("en-IN")} INR sent to ${name}`}
            </p>

            <div className="success-card__actions">
              <Button
                onClick={() => navigate("/dashboard")}
                className="success-card__button"
                text="Dashboard"
                variant="secondary"
              />
              <Button
                onClick={() => {
                  setSuccess(false);
                  setAmount("");
                  setExecuteAt("");
                }}
                className="success-card__button"
                text="Send Again"
              />
            </div>
          </motion.div>
        </div>
      </GridBackground>
    );
  }

  return (
    <GridBackground>
      <div className="flow-layout">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flow-card"
        >
          <Link to="/dashboard" className="back-link">
            <svg className="back-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="panel">
            <p className="section-tag">Transfer flow</p>
            <h2 className="panel__title">Send Money</h2>
            <p className="panel__body">Choose the amount and decide whether to send now or later.</p>

            <div className="recipient-card">
              <div className="recipient-card__avatar">
                {name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="recipient-card__label">Sending to</p>
                <p className="recipient-card__name">{name}</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="status-banner status-banner--error"
              >
                {error}
              </motion.div>
            )}

            <label className="field">
              <span className="field__label">
                Amount
              </span>
              <div className="money-field">
                <span className="money-field__prefix">INR</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="money-field__input"
                />
              </div>
            </label>

            <label className="field">
              <span className="field__label">
                Schedule (Optional)
              </span>
              <input
                type="datetime-local"
                value={executeAt}
                onChange={(e) => setExecuteAt(e.target.value)}
                className="field__input"
              />
              {executeAt && (
                <button
                  onClick={() => setExecuteAt("")}
                  className="field__hint action-text"
                >
                  Clear schedule and send instantly instead
                </button>
              )}
            </label>

            <Button
              onClick={executeAt ? handleSchedule : handleTransfer}
              disabled={loading}
              className="flow-card__submit"
              text={
                loading
                  ? "Processing..."
                  : executeAt
                    ? "Schedule Payment"
                    : "Send Now"
              }
            />
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
}
