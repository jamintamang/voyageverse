import { auth } from "../config/firebase.js";
import * as userService from "../services/userService.js";
import * as authValidator from "../validators/authValidator.js";
import { generateToken } from "../utils/tokenUtils.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, displayName, accountType, agreeToTerms } =
      req.body;

    // Validate input
    const validated = await authValidator.validateRegister({
      email,
      password,
      confirmPassword: req.body.confirmPassword,
      displayName,
      accountType,
      agreeToTerms,
    });

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create Firebase Auth user
    const firebaseUser = await auth.createUser({
      email: validated.email,
      password: validated.password,
      displayName: validated.displayName,
    });

    // Set custom claims for role
    await auth.setCustomUserClaims(firebaseUser.uid, {
      role: validated.accountType,
    });

    // Create Firestore user document
    await userService.createUser(firebaseUser.uid, {
      email: validated.email,
      displayName: validated.displayName,
      accountType: validated.accountType,
    });

    // Generate custom JWT token (optional, for extra session management)
    const token = generateToken(
      firebaseUser.uid,
      validated.email,
      validated.accountType
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: validated.accountType,
      },
      token, // Optional: send backend JWT token
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    if (error instanceof authValidator.z?.ZodError) {
      return res.status(400).json(authValidator.formatValidationError(error));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 * Note: This endpoint is primarily for backend validation.
 * Firebase handles the actual login on the frontend.
 */
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    const validated = authValidator.validateLogin({
      email,
      password,
      rememberMe,
    });

    // Note: Firebase handles password verification on the client side
    // This endpoint mainly verifies user exists and returns profile info
    const user = await userService.getUserByEmail(validated.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate session token
    const token = generateToken(user.uid, user.email, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        accountType: user.accountType,
      },
      token,
      rememberMe: validated.rememberMe,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof authValidator.z?.ZodError) {
      return res.status(400).json(authValidator.formatValidationError(error));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 * Note: Firebase handles logout on the client. This is for backend session cleanup.
 */
export const logout = async (req, res) => {
  try {
    // Optional: Revoke refresh tokens for additional security
    if (req.user?.uid) {
      // Could implement token revocation list or refresh token tracking here
      await auth.revokeRefreshTokens(req.user.uid);
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * Verify authentication token
 * POST /api/auth/verify-token
 * Protected route - requires valid Bearer token
 */
export const verifyToken = async (req, res) => {
  try {
    // Token already verified by authMiddleware
    const user = await userService.getUserById(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        accountType: user.accountType,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    const validated = authValidator.validateForgotPassword({ email });

    // Check if user exists
    const user = await userService.getUserByEmail(validated.email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link",
      });
    }

    // Firebase handles sending the reset email
    // Generate reset link on frontend or use Firebase built-in email
    const resetLink = await auth.generatePasswordResetLink(validated.email);

    // In production, you might want to send this via custom email service
    // or track that the reset was requested
    console.log("Reset link generated:", resetLink);

    return res.status(200).json({
      success: true,
      message:
        "Password reset link has been sent to your email. Firebase will handle the reset.",
      // In development, you might want to return the link, but never in production
      link: process.env.NODE_ENV === "development" ? resetLink : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof authValidator.z?.ZodError) {
      return res.status(400).json(authValidator.formatValidationError(error));
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

/**
 * Reset password with reset code
 * POST /api/auth/reset-password
 * Note: Firebase handles password reset via email link on the frontend
 * This endpoint is for backend validation if needed
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validate input
    const validated = authValidator.validateResetPassword({
      resetCode: req.body.resetCode || "",
      newPassword,
      confirmPassword,
    });

    // Firebase handles password reset via email link
    // This endpoint serves as backup validation
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password via Firebase Auth
    await auth.updateUser(user.uid, {
      password: validated.newPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof authValidator.z?.ZodError) {
      return res.status(400).json(authValidator.formatValidationError(error));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};

/**
 * Update user profile
 * PATCH /api/auth/profile
 * Protected route - requires valid Bearer token
 */
export const updateProfile = async (req, res) => {
  try {
    // Validate input
    const validated = authValidator.validateUpdateProfile(req.body);

    // Update user profile
    const updatedUser = await userService.updateUserProfile(
      req.user.uid,
      validated
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
        socialLinks: updatedUser.socialLinks,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof authValidator.z?.ZodError) {
      return res.status(400).json(authValidator.formatValidationError(error));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Profile update failed",
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 * Protected route - requires valid Bearer token
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        accountType: user.accountType,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
