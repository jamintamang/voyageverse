import { z } from "zod";
import { usernameExists } from "../services/userService.js";

// Define password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

// Register validation schema
export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    accountType: z.enum(["Creator", "Brand"]).default("Creator"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    resetCode: z.string().min(1, "Reset code is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Update profile validation schema
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profileImage: z.string().url("Invalid image URL").optional().or(z.null()),
  socialLinks: z
    .object({
      twitter: z.string().url().optional().or(z.null()),
      instagram: z.string().url().optional().or(z.null()),
      linkedin: z.string().url().optional().or(z.null()),
    })
    .optional(),
});

/**
 * Validate registration data
 * @param {object} data - Registration data
 * @returns {Promise<object>} Validated data
 * @throws {Error} Validation error
 */
export const validateRegister = async (data) => {
  try {
    // First check zod schema
    const validated = registerSchema.parse(data);

    // Check if username already exists (if provided in extended schema)
    if (validated.username && (await usernameExists(validated.username))) {
      throw new Error("Username already taken");
    }

    return validated;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate login data
 * @param {object} data - Login data
 * @returns {object} Validated data
 * @throws {Error} Validation error
 */
export const validateLogin = (data) => {
  try {
    return loginSchema.parse(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Validate forgot password data
 * @param {object} data - Forgot password data
 * @returns {object} Validated data
 * @throws {Error} Validation error
 */
export const validateForgotPassword = (data) => {
  try {
    return forgotPasswordSchema.parse(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Validate reset password data
 * @param {object} data - Reset password data
 * @returns {object} Validated data
 * @throws {Error} Validation error
 */
export const validateResetPassword = (data) => {
  try {
    return resetPasswordSchema.parse(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Validate profile update data
 * @param {object} data - Profile update data
 * @returns {object} Validated data
 * @throws {Error} Validation error
 */
export const validateUpdateProfile = (data) => {
  try {
    return updateProfileSchema.parse(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Zod error formatter for API responses
 * @param {Error} error - Zod validation error
 * @returns {object} Formatted error response
 */
export const formatValidationError = (error) => {
  if (error instanceof z.ZodError) {
    const fieldErrors = {};
    error.errors.forEach((err) => {
      const field = err.path.join(".");
      fieldErrors[field] = err.message;
    });
    return {
      success: false,
      message: "Validation failed",
      errors: fieldErrors,
    };
  }

  return {
    success: false,
    message: error.message || "Validation error",
  };
};
