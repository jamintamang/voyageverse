import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../../auth/AuthLayout.jsx";
import RegisterForm from "../../auth/RegisterForm.jsx";
import SocialLogin from "../../auth/SocialLogin.jsx";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Register page - User registration with multiple authentication options
 */
export const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, sessionResolved } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!sessionResolved) return;
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [sessionResolved, isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    navigate("/dashboard");
  };

  const handleSocialSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join VoyageVerse and start building your brand"
    >
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
        <SocialLogin onSuccess={handleSocialSuccess} isSignup={true} />
      </motion.div>
    </AuthLayout>
  );
};

export default Register;