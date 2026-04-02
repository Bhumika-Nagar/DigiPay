import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "../components/Users";
import { useDebounce } from "../hooks/useDebounce";
import { motion } from "framer-motion";
import GridBackground from "../components/GridBackground";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const debouncedFilter = useDebounce(filter, 1000);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/bulk?filter=" + debouncedFilter,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUsers(response.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [debouncedFilter]);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setValue(response.data.balance);
      } catch (err) {
        console.log(err);
      }
    };
    fetchValue();
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

  return (
    <GridBackground>
      <Appbar user={user} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="md:col-span-2">
            <Balance value={value} />
          </div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-surface-800/50"
          >
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-4">
              Quick Actions
            </p>
            <div className="space-y-3">
              <Link
                to="/scheduled"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 border border-surface-700/30 hover:border-surface-700/50 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors">Scheduled Payments</p>
                  <p className="text-xs text-surface-500">View & manage</p>
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
