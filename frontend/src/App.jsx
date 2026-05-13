import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase.js";
import { useAuth } from "./hooks/useAuth.js";

// Auth pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Protected route
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

/**
 * Main App component with routing
 */
function App() {
  const { setUser, setToken, logout } = useAuth();

  // Sync Firebase auth state with Zustand store
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User logged in - get ID token and sync with store
        const idToken = await firebaseUser.getIdToken();
        const decodedToken = await firebaseUser.getIdTokenResult();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: decodedToken.claims.role || "Creator",
          accountType: decodedToken.claims.role || "Creator",
        });

        setToken(idToken);
      } else {
        // User logged out
        logout();
      }
    });

    return unsubscribe;
  }, [setUser, setToken, logout]);

  return (
    <Router>
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                  <p className="text-white/70 mb-8">
                    Welcome to VoyageVerse Dashboard (Coming Soon)
                  </p>
                  <button
                    onClick={() => logout()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Root route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <a
                  href="/login"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Go to Login
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;