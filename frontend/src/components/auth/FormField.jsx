import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Reusable form field component with validation and error display
 */
export const FormField = ({
  label,
  type = "text",
  placeholder,
  error,
  disabled = false,
  icon: Icon,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none">
            <Icon size={18} />
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white/10 border-2 transition-all duration-200
            text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? "pl-12" : ""}
            ${
              isFocused
                ? "border-white/40 bg-white/15 shadow-lg shadow-blue-500/20"
                : "border-white/20"
            }
            ${error ? "border-red-500/50 bg-red-500/5" : ""}
          `}
          {...inputProps}
        />

        {/* Glow effect on focus */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;
