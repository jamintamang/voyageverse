import jwt from "jsonwebtoken";
import { auth } from "../config/firebase.js";
import { extractBearerToken } from "../utils/tokenUtils.js";

/**
 * Required authentication middleware
 * Verifies Firebase ID token and attaches user to req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware
 * Verifies token if provided, but allows unauthenticated access
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    }
    next();
  } catch (error) {
    // Log error but don't fail - optional auth
    console.warn("Optional auth error:", error.message);
    next();
  }
};

/**
 * Role-based authorization middleware
 * Must be used after authMiddleware
 * @param {...string} allowedRoles - Roles allowed to access the route
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user context",
      });
    }

    const userRole = req.user.custom_claims?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Required role(s): ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

export default authMiddleware;