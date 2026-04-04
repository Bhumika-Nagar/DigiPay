import { motion } from "framer-motion";

function Button({
  text,
  label,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
}) {
  const classes =
    variant === "secondary"
      ? "button button--secondary"
      : variant === "danger"
        ? "button button--danger"
        : "button button--primary";

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      className={`${classes} ${className}`.trim()}
      disabled={disabled}
      type={type}
    >
      {text || label}
    </motion.button>
  );
}

export default Button;
