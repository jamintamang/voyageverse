import { motion } from "framer-motion";

/**
 * Premium Auth Layout with glassmorphism design
 * Provides a consistent layout for all authentication pages
 */
export const AuthLayout = ({ children, title, subtitle }) => {
  // Animated background shapes
  const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Shape 1 */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* Shape 2 */}
      <motion.div
        className="absolute top-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Shape 3 */}
      <motion.div
        className="absolute -bottom-40 right-20 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <FloatingShapes />

      {/* Grid background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Glassmorphism container */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl">
            {/* Header */}
            {(title || subtitle) && (
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {title && (
                  <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-sm text-white/70">{subtitle}</p>
                )}
              </motion.div>
            )}

            {/* Form content */}
            {children}
          </div>

          {/* Footer decoration */}
          <motion.div
            className="mt-8 text-center text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>Premium authentication powered by VoyageVerse</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
