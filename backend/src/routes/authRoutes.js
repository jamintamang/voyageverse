import express from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes (require valid Bearer token)
router.post("/logout", authMiddleware, authController.logout);
router.post("/verify-token", authMiddleware, authController.verifyToken);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.patch("/profile", authMiddleware, authController.updateProfile);

export default router;
