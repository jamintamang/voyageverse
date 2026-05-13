import { db, auth } from "../config/firebase.js";
import bcryptjs from "bcryptjs";

/**
 * Create a new user in Firestore and Firebase Auth
 * @param {string} uid - Firebase UID
 * @param {object} userData - User data {email, displayName, accountType}
 * @returns {Promise<object>} Created user document
 */
export const createUser = async (uid, userData) => {
  try {
    const { email, displayName, accountType = "Creator" } = userData;

    const userRef = db.collection("users").doc(uid);
    const userDoc = {
      uid,
      email,
      displayName,
      accountType,
      role: accountType, // Map accountType to role
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: false,
      preferences: {
        theme: "dark",
        notifications: true,
      },
      profileImage: null,
      bio: "",
      socialLinks: {
        twitter: null,
        instagram: null,
        linkedin: null,
      },
    };

    await userRef.set(userDoc);
    return userDoc;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Get user by UID
 * @param {string} uid - Firebase UID
 * @returns {Promise<object|null>} User document or null
 */
export const getUserById = async (uid) => {
  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data();
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<object|null>} User document or null
 */
export const getUserByEmail = async (email) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    throw new Error(`Failed to get user by email: ${error.message}`);
  }
};

/**
 * Check if username exists
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} True if exists
 */
export const usernameExists = async (username) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("username", "==", username.toLowerCase())
      .limit(1)
      .get();

    return !querySnapshot.empty;
  } catch (error) {
    throw new Error(`Failed to check username: ${error.message}`);
  }
};

/**
 * Update user role with Firebase Custom Claims
 * @param {string} uid - Firebase UID
 * @param {string} role - New role (Creator, Brand, Admin)
 * @returns {Promise<void>}
 */
export const setUserRole = async (uid, role) => {
  try {
    // Set custom claims in Firebase Auth
    await auth.setCustomUserClaims(uid, { role });

    // Update Firestore document
    await db.collection("users").doc(uid).update({
      role,
      accountType: role,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(`Failed to set user role: ${error.message}`);
  }
};

/**
 * Update user profile
 * @param {string} uid - Firebase UID
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} Updated user document
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const allowedUpdates = [
      "displayName",
      "bio",
      "profileImage",
      "username",
      "preferences",
      "socialLinks",
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    filteredUpdates.updatedAt = new Date();

    await db.collection("users").doc(uid).update(filteredUpdates);

    // Also update Firebase Auth profile
    if (updates.displayName) {
      await auth.updateUser(uid, { displayName: updates.displayName });
    }

    return await getUserById(uid);
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

/**
 * Mark email as verified
 * @param {string} uid - Firebase UID
 * @returns {Promise<void>}
 */
export const markEmailAsVerified = async (uid) => {
  try {
    await db.collection("users").doc(uid).update({
      isEmailVerified: true,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(`Failed to mark email as verified: ${error.message}`);
  }
};

/**
 * Delete user (admin operation)
 * @param {string} uid - Firebase UID
 * @returns {Promise<void>}
 */
export const deleteUser = async (uid) => {
  try {
    // Delete from Firestore
    await db.collection("users").doc(uid).delete();

    // Delete from Firebase Auth
    await auth.deleteUser(uid);
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};
