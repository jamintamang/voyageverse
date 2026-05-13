import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import FormField from "../components/auth/FormField.jsx";
import useLogin from "../hooks/useLogin.js";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Login form component with email/password authentication
 */
export const LoginForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { login, isLoading, error: loginError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password, data.rememberMe);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email field */}
      <FormField
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password field */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`
              w-full px-4 py-3 pl-12 rounded-lg
              bg-white/10 border-2 transition-all duration-200
              text-white placeholder-white/50
              focus:outline-none focus:border-white/40 focus:bg-white/15
              ${errors.password ? "border-red-500/50 bg-red-500/5" : "border-white/20"}
            `}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </motion.div>

      {/* Remember me & Forgot password */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-500 cursor-pointer"
          />
          <span className="text-sm text-white/70">Remember me</span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          Forgot password?
        </a>
      </motion.div>

      {/* Error message */}
      {loginError && (
        <motion.div
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loginError}
        </motion.div>
      )}

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {/* Gradient shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        <span className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </span>
      </motion.button>

      {/* Sign up link */}
      <motion.p
        className="text-center text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        Don't have an account?{" "}
        <a href="/register" className="text-blue-400 hover:text-blue-300 transition">
          Sign up
        </a>
      </motion.p>
    </form>
  );
};

export default LoginForm;
