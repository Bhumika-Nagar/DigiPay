import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { useEffect, useState } from "react";
import { Users } from "../components/Users";
import { useDebounce } from "../hooks/useDebounce";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";
import { Link } from "react-router-dom";
import { AUTH_BYPASS, DEMO_USER, DEMO_USERS } from "../config/devMode";
import { api } from "../lib/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const debouncedFilter = useDebounce(filter, 1000);

  useEffect(() => {
    if (AUTH_BYPASS) {
      const filteredUsers = DEMO_USERS.filter((entry) => {
        const query = debouncedFilter.trim().toLowerCase();
        if (!query) {
          return true;
        }

        return `${entry.firstname} ${entry.lastname}`.toLowerCase().includes(query);
      });

      setUsers(filteredUsers);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/bulk?filter=" + debouncedFilter);
        setUsers(response.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [debouncedFilter]);

  useEffect(() => {
    if (AUTH_BYPASS) {
      setValue(82450);
      return;
    }

    const fetchValue = async () => {
      try {
        const response = await api.get("/account/balance");
        setValue(response.data.balance);
      } catch (err) {
        console.log(err);
      }
    };
    fetchValue();
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

  return (
    <GridBackground>
      <Appbar user={user} />

      <div className="app-layout">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="hero-panel"
        >
          <div>
            <p className="section-tag">Wallet overview</p>
            <h1 className="hero-panel__title">
              {user?.firstname ? `Good to see you, ${user.firstname}.` : "Your wallet, re-centered."}
            </h1>
            <p className="hero-panel__body">
              Review liquidity, find recipients, and launch transfers from a
              single workspace.
            </p>
          </div>
          <div className="hero-panel__chips">
            <span className="hero-chip">Live directory search</span>
            <span className="hero-chip">Fast transfers</span>
            <span className="hero-chip">Scheduled payouts</span>
          </div>
        </motion.section>

        <div className="dashboard-grid">
          <div className="dashboard-grid__primary">
            <Balance value={value} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="panel panel--compact"
          >
            <p className="panel__eyebrow">
              Quick Actions
            </p>
            <div className="action-stack">
              <Link
                to="/scheduled"
                className="action-card"
              >
                <div className="action-card__icon">
                  <svg className="action-card__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="action-card__content">
                  <p className="action-card__title">Scheduled Payments</p>
                  <p className="action-card__body">View, monitor, and cancel pending transfers.</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        <Users users={users} setFilter={setFilter} />
      </div>
    </GridBackground>
  );
}
