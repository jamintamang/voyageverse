import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import FormField from "../components/auth/FormField.jsx";
import PasswordStrengthIndicator from "../components/auth/PasswordStrengthIndicator.jsx";
import useRegister from "../hooks/useRegister.js";
import axios from "axios";

// Validation schema
const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    accountType: z.enum(["Creator", "Brand"]).default("Creator"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Register form component with multi-field validation
 */
export const RegisterForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser, isLoading, error: registerError } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");
  const accountType = watch("accountType");

  const onSubmit = async (data) => {
    const result = await registerUser(
      data.email,
      data.password,
      data.displayName,
      data.accountType,
      data.confirmPassword
    );
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Display name field */}
      <FormField
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={User}
        error={errors.displayName?.message}
        {...register("displayName")}
      />

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <label className="block text-sm font-medium text-white/80 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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

        {/* Password strength indicator */}
        <PasswordStrengthIndicator password={password} />
      </motion.div>

      {/* Confirm password field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <label className="block text-sm font-medium text-white/80 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
            <Lock size={18} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className={`
              w-full px-4 py-3 pl-12 rounded-lg
              bg-white/10 border-2 transition-all duration-200
              text-white placeholder-white/50
              focus:outline-none focus:border-white/40 focus:bg-white/15
              ${
                errors.confirmPassword
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-white/20"
              }
            `}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </motion.div>

      {/* Account type selector */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <label className="block text-sm font-medium text-white/80 mb-3">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["Creator", "Brand"].map((type) => (
            <label
              key={type}
              className={`
                relative p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  accountType === type
                    ? "border-blue-500/60 bg-blue-500/10"
                    : "border-white/20 bg-white/5 hover:border-white/30"
                }
              `}
            >
              <input
                type="radio"
                value={type}
                {...register("accountType")}
                className="sr-only"
              />
              <div className="flex items-center justify-center">
                <span className="text-sm font-medium text-white">{type}</span>
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Terms & Conditions */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("agreeToTerms")}
            className="w-4 h-4 mt-1 rounded bg-white/10 border-white/20 text-blue-500 cursor-pointer"
          />
          <span className="text-xs text-white/70">
            I agree to the{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-xs text-red-400">{errors.agreeToTerms.message}</p>
        )}
      </motion.div>

      {/* Error message */}
      {registerError && (
        <motion.div
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {registerError}
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </span>
      </motion.button>

      {/* Sign in link */}
      <motion.p
        className="text-center text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:text-blue-300 transition">
          Sign in
        </a>
      </motion.p>
    </form>
  );
};

export default RegisterForm;
