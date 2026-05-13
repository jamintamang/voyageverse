import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../../auth/AuthLayout.jsx";
import LoginForm from "../../auth/LoginForm.jsx";
import SocialLogin from "../../auth/SocialLogin.jsx";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Login page - Premium authentication interface
 */
export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  const handleSocialSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to VoyageVerse"
    >
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <LoginForm onSuccess={handleLoginSuccess} />
        <SocialLogin onSuccess={handleSocialSuccess} isSignup={false} />
      </motion.div>
    </AuthLayout>
  );
};

export default Login;