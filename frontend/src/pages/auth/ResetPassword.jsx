import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import AuthLayout from "../../auth/AuthLayout.jsx";
import FormField from "../../components/auth/FormField.jsx";
import PasswordStrengthIndicator from "../../components/auth/PasswordStrengthIndicator.jsx";
import useForgotPassword from "../../hooks/useForgotPassword.js";

/**
 * Reset Password page - Complete password reset after email link
 */
export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { resetPassword, isLoading, error } = useForgotPassword();

  const resetCode = searchParams.get("oobCode"); // Firebase reset code from email link

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    const result = await resetPassword(newPassword, confirmPassword);
    if (result.success) {
      setResetSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  if (!resetCode) {
    return (
      <AuthLayout title="Invalid Link" subtitle="The password reset link is invalid or has expired">
        <motion.div className="text-center space-y-6">
          <p className="text-white/70">
            The password reset link you used is invalid or has expired. Please
            request a new one.
          </p>
          <motion.button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Request New Link
          </motion.button>
        </motion.div>
      </AuthLayout>
    );
  }

  if (resetSuccess) {
    return (
      <AuthLayout
        title="Password Reset"
        subtitle="Your password has been successfully reset"
      >
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-white/70 text-sm mb-6">
              You can now log in with your new password.
            </p>
            <p className="text-white/50 text-xs">
              Redirecting to login page in 2 seconds...
            </p>
          </motion.div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your new password to reset your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New password field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          <PasswordStrengthIndicator password={newPassword} />
        </motion.div>

        {/* Confirm password field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              <Lock size={18} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`
                w-full px-4 py-3 pl-12 rounded-lg
                bg-white/10 border-2 transition-all
                text-white placeholder-white/50
                focus:outline-none focus:border-white/40 focus:bg-white/15
                ${
                  newPassword &&
                  confirmPassword &&
                  newPassword === confirmPassword
                    ? "border-green-500/50"
                    : "border-white/20"
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition"
            >
              {showConfirm ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mismatch message */}
          {confirmPassword &&
            newPassword !== confirmPassword && (
              <motion.p
                className="mt-1 text-sm text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Passwords don't match
              </motion.p>
            )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={
            isLoading ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </motion.button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
