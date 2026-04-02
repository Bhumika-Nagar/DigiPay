import { InputBox } from "../components/InputBox";
import { Bottom } from "../components/Bottom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";

const Signup = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/v1/user/signup", {
        username,
        firstname,
        lastname,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          
          <div className="glass-card gradient-border rounded-2xl p-8">
            
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center">
              Create Account
            </h1>
            <p className="text-surface-400 text-sm text-center mt-2 mb-8">
              Join DigiPay and start sending money instantly
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="John"
                label="First Name"
              />
              <InputBox
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Doe"
                label="Last Name"
              />
            </div>
            <InputBox
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe@gmail.com"
              label="Email"
            />
            <InputBox
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              label="Password"
              type="password"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignup}
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <Bottom
              label="Already have an account?"
              buttonText="Sign in"
              to="/signin"
            />
          </div>

          
          <p className="text-center text-xs text-surface-600 mt-6">
            Secure payments powered by DigiPay
          </p>
        </motion.div>
      </div>
    </GridBackground>
  );
};

export default Signup;
