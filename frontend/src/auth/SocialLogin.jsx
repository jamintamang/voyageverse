import { motion } from "framer-motion";
import { useState } from "react";
import useGoogleAuth from "../hooks/useGoogleAuth.js";
import useGithubAuth from "../hooks/useGithubAuth.js";

/**
 * Social login component with Google and GitHub authentication
 */
export const SocialLogin = ({ onSuccess, isSignup = false }) => {
  const { loginWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const { loginWithGithub, isLoading: githubLoading } = useGithubAuth();
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setError(null);
    const result = await loginWithGoogle(isSignup);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    const result = await loginWithGithub(isSignup);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Divider */}
      <motion.div
        className="relative flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-xs text-white/50 uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      {/* Social buttons grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google button */}
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || githubLoading}
          className="py-3 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {googleLoading ? (
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          ) : (
            <>
              {/* Google icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm">Google</span>
            </>
          )}
        </motion.button>

        {/* GitHub button */}
        <motion.button
          type="button"
          onClick={handleGithubLogin}
          disabled={githubLoading || googleLoading}
          className="py-3 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          {githubLoading ? (
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          ) : (
            <>
              {/* GitHub icon */}
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm">GitHub</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SocialLogin;
