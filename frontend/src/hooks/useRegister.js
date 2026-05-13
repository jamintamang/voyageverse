import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase.js";
import { useAuth } from "./useAuth.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Register hook - Handles user registration with Firebase and backend
 */
export const useRegister = () => {
  const { setUser, setToken, setLoading, setError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const register = async (
    email,
    password,
    displayName,
    accountType,
    confirmPassword
  ) => {
    try {
      clearError();
      setRegisterError(null);
      setIsLoading(true);
      setLoading(true);

      // Validate on client side
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName,
      });

      // Get ID token
      const idToken = await firebaseUser.getIdToken();

      // Register with backend
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          email,
          password,
          confirmPassword,
          displayName,
          accountType,
          agreeToTerms: true,
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

        return {
          success: true,
          user: response.data.user,
          message: "Registration successful",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already registered";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setRegisterError(errorMessage);
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

  return { register, isLoading, error: registerError };
};

export default useRegister;
