import { motion } from "framer-motion";

/**
 * Password strength indicator with visual feedback
 */
export const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;

    if (!pwd) return { score: 0, label: "", color: "" };

    // Length
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (pwd.length >= 16) strength += 1;

    // Character variety
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    return strength;
  };

  const getStrengthInfo = (score) => {
    if (score === 0) return { label: "", color: "bg-gray-600" };
    if (score <= 2) return { label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { label: "Fair", color: "bg-yellow-500" };
    if (score <= 6) return { label: "Strong", color: "bg-blue-500" };
    return { label: "Very Strong", color: "bg-green-500" };
  };

  const score = calculateStrength(password);
  const info = getStrengthInfo(score);
  const percentage = (score / 7) * 100;

  if (!password) return null;

  return (
    <motion.div
      className="mt-2 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${info.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Strength label */}
      <motion.div
        className="flex items-center justify-between mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <span className="text-xs text-white/70">Password Strength</span>
        <span className={`text-xs font-medium text-${info.color}`}>
          {info.label}
        </span>
      </motion.div>

      {/* Requirements checklist */}
      <motion.div
        className="mt-3 space-y-1 text-xs text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {[
          { label: "At least 8 characters", check: password.length >= 8 },
          { label: "Uppercase letter", check: /[A-Z]/.test(password) },
          { label: "Lowercase letter", check: /[a-z]/.test(password) },
          { label: "Number", check: /[0-9]/.test(password) },
        ].map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center ${
              req.check ? "text-green-400" : "text-white/50"
            }`}
          >
            <span className="mr-2">{req.check ? "✓" : "○"}</span>
            <span>{req.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PasswordStrengthIndicator;
