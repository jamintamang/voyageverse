import jwt from "jsonwebtoken";

/**
 * Generate a custom JWT token for additional session management
 * @param {string} uid - Firebase user ID
 * @param {string} email - User email
 * @param {string} role - User role (Creator, Brand, Admin)
 * @returns {string} JWT token
 */
export const generateToken = (uid, email, role) => {
  return jwt.sign(
    { uid, email, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Extract Bearer token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractBearerToken = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  
  return parts[1];
};

/**
 * Decode Firebase ID token without verification (for claims inspection)
 * @param {string} token - Firebase ID token
 * @returns {object} Decoded token
 */
export const decodeIdToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Failed to decode token");
  }
};
