import { InputBox } from "../components/InputBox";
import { Bottom } from "../components/Bottom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";
import Button from "../components/Button";
import { AUTH_BYPASS } from "../config/devMode";
import { api, setAuthToken } from "../lib/api";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    if (AUTH_BYPASS) {
      navigate("/dashboard");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await api.post("/user/signin", {
        username,
        password,
      });
      setAuthToken(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <div className="auth-layout">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="auth-panel auth-panel--aside"
        >
          <p className="section-tag">Existing account</p>
          <h1 className="auth-panel__title">Step back into your transfer desk.</h1>
          <p className="auth-panel__body">
            Review balances, schedule payouts, and pick up where your last
            transfer left off.
          </p>
          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Fast send flow</strong>
              <span>Search a user, choose an amount, and move funds quickly.</span>
            </div>
            <div className="auth-highlight">
              <strong>Scheduled payments</strong>
              <span>Queue upcoming transfers and monitor execution status.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="auth-panel auth-panel--form"
        >
          <div className="auth-card">
            <p className="section-tag">Sign in</p>
            <h2 className="auth-card__title">Welcome back</h2>
            <p className="auth-card__body">Use your registered email and password.</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="status-banner status-banner--error"
              >
                {error}
              </motion.div>
            )}

            <InputBox
              label="Email"
              placeholder="johndoe@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputBox
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              onClick={handleSignin}
              disabled={loading}
              className="auth-card__submit"
              text={loading ? "Signing in..." : "Sign In"}
            />

            <Bottom
              label="Don't have an account?"
              buttonText="Sign up"
              to="/signup"
            />
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
};

export default Signin;
