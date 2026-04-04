import { InputBox } from "../components/InputBox";
import { Bottom } from "../components/Bottom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";
import Button from "../components/Button";
import { AUTH_BYPASS } from "../config/devMode";
import { api, setAuthToken } from "../lib/api";

const Signup = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (AUTH_BYPASS) {
      navigate("/dashboard");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await api.post("/user/signup", {
        username,
        firstname,
        lastname,
        password,
      });
      setAuthToken(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          <p className="section-tag">New account</p>
          <h1 className="auth-panel__title">Open a cleaner way to handle payments.</h1>
          <p className="auth-panel__body">
            Create your DigiPay account to access a focused wallet dashboard,
            scheduled transfers, and a modern send flow.
          </p>
          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Elegant dashboard</strong>
              <span>Balance, contacts, and quick actions in one place.</span>
            </div>
            <div className="auth-highlight">
              <strong>Built for repeat use</strong>
              <span>Consistent layouts and feedback across every payment state.</span>
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
            <p className="section-tag">Create account</p>
            <h2 className="auth-card__title">Join DigiPay</h2>
            <p className="auth-card__body">Set up your wallet in under a minute.</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="status-banner status-banner--error"
              >
                {error}
              </motion.div>
            )}

            <div className="field-row">
              <InputBox
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="John"
                label="First Name"
                value={firstname}
              />
              <InputBox
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Doe"
                label="Last Name"
                value={lastname}
              />
            </div>
            <InputBox
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe@gmail.com"
              label="Email"
              value={username}
            />
            <InputBox
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              label="Password"
              type="password"
              value={password}
            />

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="auth-card__submit"
              text={loading ? "Creating account..." : "Create Account"}
            />

            <Bottom
              label="Already have an account?"
              buttonText="Sign in"
              to="/signin"
            />
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
};

export default Signup;
