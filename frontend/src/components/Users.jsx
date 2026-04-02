import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Users({ users, setFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">People</h2>
        <span className="text-xs text-surface-500">
          {users?.length || 0} users found
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search by name..."
          className="input-field pl-11"
        />
      </div>

      {/* User List */}
      <div className="space-y-2">
        {users?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl glass-card-light hover:border-primary-500/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-600 to-surface-700 flex items-center justify-center text-white font-semibold text-sm border border-surface-600/50">
                {user.firstname?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-xs text-surface-500">{user.username}</p>
              </div>
            </div>

            <Link to={`/send?id=${user._id}&name=${user.firstname}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 hover:border-primary-500/30 transition-all duration-300"
              >
                Send Money
              </motion.button>
            </Link>
          </motion.div>
        ))}

        {users?.length === 0 && (
          <div className="text-center py-12 text-surface-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm">No users found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
