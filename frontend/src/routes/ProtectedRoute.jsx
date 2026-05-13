import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Protected Route component - Guards routes from unauthenticated users
 */
export const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * Role Protected Route - More granular role-based access control
 */
export const RoleProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">
            You don't have permission to access this page.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
