# VoyageVerse Authentication System Setup Guide

## Overview
Complete modern authentication system with premium UI/UX, glassmorphism design, and Framer Motion animations. Features Firebase Auth, JWT tokens, Zustand state management, and role-based access control.

## Architecture

### Backend (Express.js)
- **Firebase Admin SDK** for user management and authentication verification
- **JWT token generation** for custom session management
- **Zod validation** for input sanitization
- **Role-based authorization middleware** (Creator, Brand, Admin)
- **Firestore** for user profiles and role storage

### Frontend (React + Vite)
- **Firebase Auth SDK** for email/password, Google, and GitHub authentication
- **Zustand** for global state management with localStorage persistence
- **React Hook Form** + **Zod** for form validation
- **Framer Motion** for smooth animations
- **Tailwind CSS** with glassmorphism effects
- **React Router** v7 for protected routing

## Installation & Setup

### 1. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable the following services:
   - **Authentication**: Email/Password, Google, GitHub
   - **Firestore Database**: Create in test mode initially
   - **Cloud Storage** (optional, for profile images)

#### Download Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `backend/src/config/serviceAccountKey.json`
4. **⚠️ IMPORTANT**: Never commit this file to version control

#### Get Firebase Config
1. Go to Project Settings → General
2. Scroll to "Your apps" and select Web app
3. Copy the Firebase config object
4. You'll need these values for `.env.local` in frontend

### 2. Backend Setup

```bash
cd backend

# Create .env file from template
cp .env.example .env

# Edit .env with your values:
# - JWT_SECRET: Generate a strong random string
# - CORS_ORIGIN: Add your frontend URL (http://localhost:5173 for dev)
# - PORT: 3000 (or your desired port)

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

**Backend will be available at**: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Create .env.local file from template
cp .env.example .env.local

# Edit .env.local with your Firebase credentials:
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
# VITE_API_URL=http://localhost:3000

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

**Frontend will be available at**: `http://localhost:5173`

## API Endpoints

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ email, password, confirmPassword, displayName, accountType, agreeToTerms }`
- **Response**: User object, JWT token
- **Account Types**: "Creator" | "Brand"

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password, rememberMe }`
- **Response**: User object, JWT token
- **Note**: Frontend handles Firebase login; backend validates

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

#### Verify Token
- **POST** `/api/auth/verify-token`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user data
- **Protected**: Yes

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**: `{ email }`
- **Response**: Firebase sends reset email
- **Protected**: No

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ email, newPassword, confirmPassword }`
- **Response**: Success message
- **Protected**: No

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Full user profile
- **Protected**: Yes

#### Update Profile
- **PATCH** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ displayName, bio, profileImage, socialLinks }`
- **Response**: Updated user profile
- **Protected**: Yes

## Authentication Flow

### Email/Password Registration
```
User fills form → Client validation (React Hook Form + Zod)
  ↓
Firebase: createUserWithEmailAndPassword()
  ↓
Firebase Custom Claims: setCustomUserClaims(uid, { role })
  ↓
Backend: Create Firestore user document
  ↓
Generate JWT token
  ↓
Update Zustand store with user data
  ↓
Redirect to /dashboard
```

### Email/Password Login
```
User enters email/password → Client validation
  ↓
Firebase: signInWithEmailAndPassword()
  ↓
Get Firebase ID token (contains custom claims)
  ↓
Backend: Verify token, fetch Firestore profile
  ↓
Generate backend JWT token
  ↓
Update Zustand store
  ↓
Redirect to /dashboard
```

### Social Authentication (Google/GitHub)
```
User clicks "Login with Google/GitHub"
  ↓
Firebase: signInWithPopup()
  ↓
If new user: Backend creates Firestore profile
  ↓
Get Firebase ID token
  ↓
Update Zustand store
  ↓
Redirect to /dashboard
```

### Password Reset
```
User enters email → Client validation
  ↓
Backend: Generate Firebase reset link
  ↓
Firebase: sendPasswordResetEmail()
  ↓
User clicks link in email
  ↓
Firebase password reset page loads
  ↓
User sets new password
  ↓
User logs in with new password
```

## Frontend Routes

| Route | Component | Protected | Roles |
|-------|-----------|-----------|-------|
| `/login` | Login page | No | Public |
| `/register` | Register page | No | Public |
| `/forgot-password` | Password reset request | No | Public |
| `/reset-password` | Password reset form | No | Public |
| `/dashboard` | Dashboard | Yes | All |
| `/ai-studio` | AI Features | Yes | Creator, Brand |
| `/analytics` | Analytics | Yes | Creator, Admin |
| `/profile` | Profile Settings | Yes | All |

## File Structure

### Backend
```
backend/src/
├── config/
│   ├── firebase.js          # Firebase Admin SDK init
│   ├── cloudinary.js        # (existing)
│   └── serviceAccountKey.json  # (⚠️ DO NOT COMMIT)
├── middleware/
│   └── authMiddleware.js    # Bearer token parsing, JWT verification, role checks
├── routes/
│   └── authRoutes.js        # All auth endpoints
├── controllers/
│   └── authController.js    # Register, login, password reset, profile
├── services/
│   └── userService.js       # Firestore operations, user CRUD
├── validators/
│   └── authValidator.js     # Zod schemas, input validation
└── utils/
    └── tokenUtils.js        # JWT generation, token extraction
```

### Frontend
```
frontend/src/
├── config/
│   └── firebase.js          # Firebase SDK init, auth configuration
├── stores/
│   └── authStore.js         # Zustand auth store with persistence
├── hooks/
│   ├── useAuth.js           # Main auth hook
│   ├── useLogin.js          # Email/password login
│   ├── useRegister.js       # Email/password signup
│   ├── useGoogleAuth.js     # Google OAuth
│   ├── useGithubAuth.js     # GitHub OAuth
│   └── useForgotPassword.js # Password reset flow
├── auth/
│   ├── AuthLayout.jsx       # Premium glassmorphism wrapper
│   ├── LoginForm.jsx        # Login form with validation
│   ├── RegisterForm.jsx     # Registration form with account type
│   └── SocialLogin.jsx      # Google/GitHub buttons
├── components/auth/
│   ├── FormField.jsx        # Reusable input component
│   └── PasswordStrengthIndicator.jsx # Password strength meter
├── pages/auth/
│   ├── Login.jsx            # Login page wrapper
│   ├── Register.jsx         # Register page wrapper
│   ├── ForgotPassword.jsx   # Password reset request
│   └── ResetPassword.jsx    # Password reset form
├── routes/
│   └── ProtectedRoute.jsx   # Route guard component
├── App.jsx                  # Main router setup
└── main.jsx                 # Entry point
```

## Security Features

✅ **Password Hashing**: Firebase handles password hashing  
✅ **JWT Tokens**: Signed with JWT_SECRET  
✅ **Bearer Token Parsing**: Proper Authorization header handling  
✅ **Firebase Custom Claims**: Role-based claims in JWT  
✅ **Firestore Rules**: Restrict database access by user  
✅ **Input Validation**: Zod schemas on frontend + backend  
✅ **CORS Protection**: Restricted to frontend domain  
✅ **Rate Limiting**: Already configured on auth endpoints  
✅ **Helmet Headers**: Security headers enabled  
✅ **Session Persistence**: localStorage with Zustand  

## Firestore Database Structure

```
users/
├── {uid}
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── role: "Creator" | "Brand" | "Admin"
│   ├── accountType: "Creator" | "Brand"
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   ├── isEmailVerified: boolean
│   ├── bio: string
│   ├── profileImage: string | null
│   ├── preferences: {
│   │   └── theme: "dark" | "light"
│   │   └── notifications: boolean
│   └── socialLinks: {
│       ├── twitter: string | null
│       ├── instagram: string | null
│       └── linkedin: string | null
```

## Firestore Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Public user profiles (read-only for search/discovery)
    match /profiles/{uid} {
      allow read: if true;
      allow write: if request.auth.uid == uid;
    }
  }
}
```

## Customization

### Add New Role
1. Update `accountType` options in `registerSchema` (Zod)
2. Update role middleware to check new role
3. Create role-specific routes with `requireRole()`
4. Add role to protected routes

### Customize Firebase Providers
Edit `frontend/src/config/firebase.js`:
- Add `facebookProvider = new FacebookAuthProvider()`
- Configure provider settings
- Add buttons to SocialLogin component

### Modify Password Requirements
Edit `backend/src/validators/authValidator.js`:
- Update `passwordSchema` regex patterns
- Add custom validation rules
- Update error messages

### Change Glassmorphism Styling
Edit `frontend/src/auth/AuthLayout.jsx` and `LoginForm.jsx`:
- Modify backdrop blur: `backdrop-blur-xl`
- Adjust opacity: `bg-white/10`
- Change border styles: `border-white/20`
- Update colors and gradients

## Troubleshooting

### "serviceAccountKey.json not found"
- Download from Firebase Console → Project Settings → Service Accounts
- Place in `backend/src/config/serviceAccountKey.json`
- Add to `.gitignore`

### CORS errors
- Check `CORS_ORIGIN` in `.env` matches your frontend URL
- Ensure both frontend and backend are running
- Try `CORS_ORIGIN=*` temporarily for debugging

### "Firebase is not initialized"
- Check `VITE_FIREBASE_*` variables in `.env.local`
- Verify Firebase config in `frontend/src/config/firebase.js`
- Check browser console for errors

### Tokens not persisting after refresh
- Verify Zustand store uses `persist` middleware
- Check localStorage in browser DevTools
- Ensure `firebaseUser.getIdToken()` is called after login

### "Invalid Bearer token"
- Confirm token is in `Authorization: Bearer <token>` format
- Verify token hasn't expired (Firebase tokens last 1 hour)
- Check backend middleware properly extracts token

## Performance Optimization

1. **Code Splitting**: Routes lazy-loaded by React Router
2. **Token Caching**: Zustand persists auth to localStorage
3. **Firebase Token Refresh**: Automatic with Firebase SDK
4. **Debounced Username Check**: 300ms delay on register form
5. **Motion Performance**: `will-change` only during animation

## Next Steps

1. ✅ Phase 1-6: Core auth system (DONE)
2. 🎨 **Phase 7**: Polish animations and UI
3. 🧪 **Phase 8**: End-to-end testing
4. 📧 Optional: Email verification on signup
5. 🔐 Optional: Two-factor authentication (2FA)
6. 📱 Optional: Mobile app authentication

## Support & Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: Production Ready
