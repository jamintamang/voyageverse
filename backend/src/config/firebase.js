import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get directory path for loading serviceAccountKey.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
const serviceAccountPath = `${__dirname}/serviceAccountKey.json`;
let serviceAccount;
let isFirebaseInitialized = false;

try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
} catch (error) {
  console.error("⚠️  Error loading serviceAccountKey.json:", error.message);
  console.error("📝 Please download your Firebase service account key and place it at:", serviceAccountPath);
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  isFirebaseInitialized = true;
  console.log("✅ Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  console.error("⚠️  Please update serviceAccountKey.json with valid Firebase credentials");
  console.error("📝 Download from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key");
}

// Get Firestore instance (only if Firebase initialized)
let db = null;
try {
  if (isFirebaseInitialized) {
    db = admin.firestore();
  }
} catch (error) {
  console.error("⚠️  Could not initialize Firestore:", error.message);
}

// Get Auth instance (only if Firebase initialized)
let auth = null;
try {
  if (isFirebaseInitialized) {
    auth = admin.auth();
  }
} catch (error) {
  console.error("⚠️  Could not initialize Firebase Auth:", error.message);
}

export { db, auth, isFirebaseInitialized };
export default admin;