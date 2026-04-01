import { motion } from "framer-motion";

function Button({ text, label, onClick, className = "", variant = "primary" }) {
  const baseClasses = variant === "danger"
    ? "btn-danger"
    : "btn-primary";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {text || label}
    </motion.button>
  );
}

export default Button;
