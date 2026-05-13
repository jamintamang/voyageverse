import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";
import { useAuth } from "./useAuth.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Login hook - Handles email/password authentication with Firebase
 */
export const useLogin = () => {
  const { setUser, setToken, setLoading, setError, clearError, setRememberMe } =
    useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = async (email, password, rememberMe = false) => {
    try {
      clearError();
      setLoginError(null);
      setIsLoading(true);
      setLoading(true);

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Verify with backend and get user profile + custom claims
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email,
          password,
          rememberMe,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

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
        setRememberMe(rememberMe);

        return {
          success: true,
          user: response.data.user,
          message: "Login successful",
        };
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed";

      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Invalid password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "User account is disabled";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setLoginError(errorMessage);
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

  return { login, isLoading, error: loginError };
};

export default useLogin;
