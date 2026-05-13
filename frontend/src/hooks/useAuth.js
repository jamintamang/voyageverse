import { useAuthStore } from "../stores/authStore.js";

/**
 * Main auth hook - provides access to auth state and actions
 */
export const useAuth = () => {
  // State
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const userRole = useAuthStore((state) => state.userRole);
  const token = useAuthStore((state) => state.token);

  // Actions
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);
  const setUserRole = useAuthStore((state) => state.setUserRole);
  const setRememberMe = useAuthStore((state) => state.setRememberMe);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    userRole,
    token,

    // Actions
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
    clearError,
    updateUserProfile,
    setUserRole,
    setRememberMe,

    // Helpers
    isCreator: userRole === "Creator",
    isBrand: userRole === "Brand",
    isAdmin: userRole === "Admin",
  };
};

export default useAuth;
