import { motion } from "framer-motion";

export default function GridBackground({ children }) {
  return (
    <div className="page-shell">
      <div className="page-shell__grid" />
      <motion.div
        className="page-shell__orb page-shell__orb--one"
        animate={{
          x: [0, 36, 0],
          y: [0, -24, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="page-shell__orb page-shell__orb--two"
        animate={{
          x: [0, -30, 0],
          y: [0, 28, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="page-shell__orb page-shell__orb--three"
        animate={{
          x: [0, 18, 0],
          y: [0, 22, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="page-shell__content">{children}</div>
    </div>
  );
}
