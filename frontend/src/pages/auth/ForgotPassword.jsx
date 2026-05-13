import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "../../auth/AuthLayout.jsx";
import FormField from "../../components/auth/FormField.jsx";
import useForgotPassword from "../../hooks/useForgotPassword.js";

/**
 * Forgot Password page - Email-based password reset flow
 */
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { requestPasswordReset, isLoading, error, success } =
    useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    const result = await requestPasswordReset(email);
    if (result.success) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We'll send you an email to reset your password"
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <FormField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </motion.button>

          {/* Back to login */}
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </motion.button>
        </form>
      ) : (
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success icon */}
          <motion.div
            className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-white/70 text-sm mb-4">
              We've sent a password reset link to:
            </p>
            <p className="text-blue-400 font-medium">{email}</p>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xs text-white/70 space-y-2">
              <span className="block">
                • Click the link in the email to reset your password
              </span>
              <span className="block">
                • The link will expire in 24 hours
              </span>
              <span className="block">
                • Check your spam folder if you don't see the email
              </span>
            </p>
          </motion.div>

          {/* Back to login button */}
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Back to Sign In
          </motion.button>
        </motion.div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;