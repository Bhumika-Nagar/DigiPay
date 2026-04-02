import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";

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
    try {
      await axios.post(
        "http://localhost:5000/api/v1/payment/schedule",
        {
          toUserId: id,
          amount: Number(amount),
          executeAt: new Date(executeAt).toISOString(),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
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
    try {
      await axios.post(
        "http://localhost:5000/api/v1/account/transfer",
        {
          to: id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
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
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card gradient-border rounded-2xl p-8 w-full max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </motion.div>

            <h2 className="text-xl font-bold text-white mb-2">
              {executeAt ? "Payment Scheduled!" : "Transfer Successful!"}
            </h2>
            <p className="text-surface-400 text-sm mb-2">
              {executeAt
                ? `${Number(amount).toLocaleString("en-IN")} INR scheduled to ${name}`
                : `${Number(amount).toLocaleString("en-IN")} INR sent to ${name}`}
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 px-4 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-300 text-sm font-medium hover:bg-surface-800 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setAmount("");
                  setExecuteAt("");
                }}
                className="flex-1 btn-primary text-sm"
              >
                Send Again
              </button>
            </div>
          </motion.div>
        </div>
      </GridBackground>
    );
  }

  return (
    <GridBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="glass-card gradient-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Send Money</h2>

            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/30 border border-surface-700/30 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                {name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-surface-500">Sending to</p>
                <p className="text-base font-semibold text-white">{name}</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

          
            <div className="mb-5">
              <label className="block text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 font-medium">INR</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-14 text-2xl font-bold"
                />
              </div>
            </div>

            
            <div className="mb-6">
              <label className="block text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                value={executeAt}
                onChange={(e) => setExecuteAt(e.target.value)}
                className="input-field [color-scheme:dark]"
              />
              {executeAt && (
                <button
                  onClick={() => setExecuteAt("")}
                  className="text-xs text-surface-500 hover:text-red-400 mt-2 transition-colors"
                >
                  Clear schedule - send instantly instead
                </button>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={executeAt ? handleSchedule : handleTransfer}
              disabled={loading}
              className={`w-full py-3.5 px-6 font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 ${
                executeAt
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40"
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : executeAt ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule Payment
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send Now
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
}
