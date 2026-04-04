import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import GridBackground from "./GridBackground";
import { AUTH_BYPASS } from "../config/devMode";
import { getStoredToken } from "../lib/api";

export default function Home() {
  const token = getStoredToken();

  if (AUTH_BYPASS) {
    return <Navigate to="/dashboard" replace />;
  }

  const primaryLink = token ? "/dashboard" : "/signup";
  const secondaryLink = token ? "/scheduled" : "/signin";

  return (
    <GridBackground>
      <div className="landing">
        <motion.div
          className="landing__hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="landing__copy">
            <span className="landing__eyebrow">Modern wallet experience</span>
            <h1 className="landing__title">
              Move money with the confidence of a private banking app.
            </h1>
            <p className="landing__body">
              DigiPay gives instant transfers, scheduled payouts, and a cleaner
              control surface for day-to-day payment flows.
            </p>
            <div className="landing__actions">
              <Link to={primaryLink} className="button button--primary">
                {token ? "Open Dashboard" : "Create Account"}
              </Link>
              <Link to={secondaryLink} className="button button--secondary">
                {token ? "View Scheduled" : "Sign In"}
              </Link>
            </div>
            <div className="landing__stats">
              <div className="metric">
                <strong>Instant</strong>
                <span>Direct transfers with a fast send flow.</span>
              </div>
              <div className="metric">
                <strong>Scheduled</strong>
                <span>Plan outgoing payments ahead of time.</span>
              </div>
              <div className="metric">
                <strong>Focused</strong>
                <span>Clean surfaces built for repeat use.</span>
              </div>
            </div>
          </div>

          <motion.div
            className="landing__showcase"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <div className="showcase-card showcase-card--hero">
              <p className="showcase-card__label">Unified payment workspace</p>
              <h2>Real-time transfers and scheduling</h2>
              <p className="showcase-card__delta">
                Connected directly to your DigiPay backend
              </p>
            </div>
            <div className="showcase-stack">
              <div className="showcase-card">
                <p className="showcase-card__label">Scheduled payments</p>
                <h3>Plan transfers ahead</h3>
                <p>
                  Queue outgoing payments and track their status from one place.
                </p>
              </div>
              <div className="showcase-card">
                <p className="showcase-card__label">Account activity</p>
                <h3>Search, send, and monitor</h3>
                <p>
                  Use live account data instead of static demo values after
                  signing in.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="feature-grid"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        >
          <article className="feature-card">
            <p className="feature-card__eyebrow">Control</p>
            <h3>Transfers that feel deliberate, not chaotic.</h3>
            <p>
              Every screen is built around one job: sign in, review balance,
              search contacts, send funds, or manage scheduled payments.
            </p>
          </article>
          <article className="feature-card">
            <p className="feature-card__eyebrow">Motion</p>
            <h3>Animations that support the flow.</h3>
            <p>
              Surfaces rise in, cards stagger, and status transitions reinforce
              what changed without turning the UI into noise.
            </p>
          </article>
          <article className="feature-card">
            <p className="feature-card__eyebrow">Theme</p>
            <h3>Warm editorial styling with fintech precision.</h3>
            <p>
              Ivory backgrounds, ink text, and brass accents keep it premium
              while preserving contrast and readability.
            </p>
          </article>
        </motion.div>
      </div>
    </GridBackground>
  );
}
