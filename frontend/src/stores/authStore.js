import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth Store - Manages global authentication state
 * Persisted to localStorage for session persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      userRole: null,
      token: null,
      rememberMe: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          userRole: user?.role || null,
        }),

      setToken: (token) => set({ token }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setRememberMe: (rememberMe) => set({ rememberMe }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          token: null,
          error: null,
          rememberMe: false,
        }),

      clearError: () => set({ error: null }),

      updateUserProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setUserRole: (role) =>
        set((state) => ({
          userRole: role,
          user: state.user ? { ...state.user, role } : null,
        })),

      // Selectors
      getUser: () => get().user,
      isAuthenticated: () => get().isAuthenticated,
      getToken: () => get().token,
      getUserRole: () => get().userRole,
      getError: () => get().error,
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        userRole: state.userRole,
        rememberMe: state.rememberMe,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export utility functions for commonly used selectors
export const useAuthState = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const userRole = useAuthStore((state) => state.userRole);
  const token = useAuthStore((state) => state.token);

  return { user, isAuthenticated, loading, error, userRole, token };
};

export const useAuthActions = () => {
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
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
    clearError,
    updateUserProfile,
    setUserRole,
    setRememberMe,
  };
};
