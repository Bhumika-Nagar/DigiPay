import { motion } from "framer-motion";

export default function GridBackground({ children }) {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated dot grid */}
      <div className="absolute inset-0 dot-grid animate-grid-fade" />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
