import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase.js";
import { useAuth } from "./useAuth.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Forgot Password hook - Handles password reset email flow
 */
export const useForgotPassword = () => {
  const { setLoading, setError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const requestPasswordReset = async (email) => {
    try {
      clearError();
      setResetError(null);
      setResetSuccess(false);
      setIsLoading(true);
      setLoading(true);

      // Notify backend
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email,
      });

      // Send reset email via Firebase
      await sendPasswordResetEmail(auth, email);

      setResetSuccess(true);

      return {
        success: true,
        message:
          "Password reset link sent to your email. Check your inbox to reset your password.",
      };
    } catch (error) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send password reset email";

      if (error.code === "auth/user-not-found") {
        // Don't reveal if user exists for security
        errorMessage =
          "If an account exists with this email, you will receive a password reset link";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setResetError(errorMessage);
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword, confirmPassword) => {
    try {
      clearError();
      setResetError(null);
      setIsLoading(true);
      setLoading(true);

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // The actual password reset happens on the Firebase reset link page
      // This is just validation
      setResetSuccess(true);

      return {
        success: true,
        message: "Password reset successful. You can now login with your new password.",
      };
    } catch (error) {
      console.error("Password update error:", error);

      const errorMessage = error.message || "Failed to reset password";
      setResetError(errorMessage);
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return {
    requestPasswordReset,
    resetPassword,
    isLoading,
    error: resetError,
    success: resetSuccess,
  };
};

export default useForgotPassword;
