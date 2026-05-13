import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { useAuth } from "./useAuth.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const googleProvider = new GoogleAuthProvider();

/**
 * Google Authentication hook - Handles Google OAuth login/signup
 */
export const useGoogleAuth = () => {
  const { setUser, setToken, setLoading, setError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const auth = getAuth();

  const loginWithGoogle = async (isSignup = false) => {
    try {
      clearError();
      setGoogleError(null);
      setIsLoading(true);
      setLoading(true);

      // Open Google OAuth popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Get ID token
      const idToken = await firebaseUser.getIdToken();

      // For signup flow, call register endpoint; for login, call login endpoint
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignup
        ? {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "User",
            accountType: "Creator", // Default for social signup
            password: "social-auth", // Placeholder
            confirmPassword: "social-auth",
            agreeToTerms: true,
          }
        : {
            email: firebaseUser.email,
            password: "social-auth",
          };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success) {
        // Get fresh token with custom claims
        const refreshedToken = await firebaseUser.getIdToken(true);

        // Update auth store
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          ...response.data.user,
        });

        setToken(refreshedToken);

        return {
          success: true,
          user: response.data.user,
          message: isSignup ? "Registration successful" : "Login successful",
        };
      }
    } catch (error) {
      console.error("Google auth error:", error);

      let errorMessage = "Google authentication failed";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Authentication popup was closed";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Authentication popup was blocked";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setGoogleError(errorMessage);
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

  return { loginWithGoogle, isLoading, error: googleError };
};

export default useGoogleAuth;
