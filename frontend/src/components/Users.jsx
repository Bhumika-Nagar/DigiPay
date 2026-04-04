import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Users({ users, setFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="panel"
    >
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Transfer Directory</p>
          <h2 className="panel__title">People</h2>
        </div>
        <span className="panel__meta">
          {users?.length || 0} users found
        </span>
      </div>

      <div className="search-field">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search by first or last name"
          className="field__input"
        />
      </div>

      <div className="user-list">
        {users?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="user-card"
          >
            <div className="user-card__identity">
              <div className="user-card__avatar">
                {user.firstname?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="user-card__name">
                  {user.firstname} {user.lastname}
                </p>
                <p className="user-card__handle">{user.username}</p>
              </div>
            </div>

            <Link className="user-card__link" to={`/send?id=${user._id}&name=${user.firstname}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button button--secondary"
              >
                Send Money
              </motion.button>
            </Link>
          </motion.div>
        ))}

        {users?.length === 0 && (
          <div className="empty-state">
            <svg className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="empty-state__title">No users found</p>
            <p className="empty-state__body">Try a different search term.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
