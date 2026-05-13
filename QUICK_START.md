# VoyageVerse Authentication - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Firebase project created
- Node.js 16+ installed
- serviceAccountKey.json from Firebase

### Step 1: Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env: Update JWT_SECRET, CORS_ORIGIN, PORT
npm run dev
```
✅ Backend running at `http://localhost:3000`

### Step 2: Setup Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: Add your Firebase credentials and API_URL
npm run dev
```
✅ Frontend running at `http://localhost:5173`

### Step 3: Test Authentication
1. Open `http://localhost:5173/register`
2. Create an account with email/password or Google/GitHub
3. You'll be redirected to `/dashboard` after login
4. Click Logout to test logout functionality

---

## 📝 Using the Authentication System

### Basic Example: Login
```jsx
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin.js';

function MyComponent() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'Password123');
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </>
  );
}
```

### Access Auth State
```jsx
import { useAuth } from '../hooks/useAuth.js';

function Dashboard() {
  const { user, userRole, isCreator, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.displayName}</h1>
      <p>Role: {userRole}</p>
      {isCreator && <p>You're a Creator!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protect Routes
```jsx
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import Dashboard from './Dashboard';

<Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### Role-Based Access
```jsx
import { RoleProtectedRoute } from '../routes/ProtectedRoute.jsx';

<Route
  path="/ai-studio"
  element={
    <RoleProtectedRoute roles={['Creator', 'Brand']}>
      <AIStudio />
    </RoleProtectedRoute>
  }
/>
```

---

## 🔑 API Usage Examples

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase_id_token>" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "displayName": "John Doe",
    "accountType": "Creator",
    "agreeToTerms": true
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase_id_token>" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "rememberMe": true
  }'
```

### Verify Token
```bash
curl -X POST http://localhost:3000/api/auth/verify-token \
  -H "Authorization: Bearer <firebase_id_token>"
```

### Get Current User Profile
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <firebase_id_token>"
```

### Update Profile
```bash
curl -X PATCH http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase_id_token>" \
  -d '{
    "displayName": "John Updated",
    "bio": "Creator and brand builder",
    "socialLinks": {
      "twitter": "https://twitter.com/user",
      "instagram": "https://instagram.com/user"
    }
  }'
```

---

## 🎨 UI Components

### Login Page
```jsx
import Login from '../pages/auth/Login.jsx';
<route path="/login" element={<Login />} />
```
Features: Email/password, "Remember me", "Forgot password", Social login

### Register Page  
```jsx
import Register from '../pages/auth/Register.jsx';
<route path="/register" element={<Register />} />
```
Features: Multi-field validation, password strength meter, account type selector

### Forgot Password Page
```jsx
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
<route path="/forgot-password" element={<ForgotPassword />} />
```
Features: Email request, Firebase email sending, success confirmation

### Reset Password Page
```jsx
import ResetPassword from '../pages/auth/ResetPassword.jsx';
<route path="/reset-password" element={<ResetPassword />} />
```
Features: Validates reset code, password strength meter, success redirect

---

## 🎮 Hooks Reference

### useAuth()
```jsx
const {
  user,              // Current user object
  isAuthenticated,   // Boolean
  loading,           // Boolean
  error,             // Error message or null
  userRole,          // 'Creator' | 'Brand' | 'Admin'
  token,             // JWT token
  
  // Helpers
  isCreator,         // userRole === 'Creator'
  isBrand,           // userRole === 'Brand'
  isAdmin,           // userRole === 'Admin'
  
  // Actions
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
  clearError,
  updateUserProfile,
  setUserRole,
  setRememberMe,
} = useAuth();
```

### useLogin()
```jsx
const { login, isLoading, error } = useLogin();
const result = await login(email, password, rememberMe);
// result: { success, user, error, message }
```

### useRegister()
```jsx
const { register, isLoading, error } = useRegister();
const result = await register(email, password, displayName, accountType, confirmPassword);
// result: { success, user, error, message }
```

### useGoogleAuth()
```jsx
const { loginWithGoogle, isLoading, error } = useGoogleAuth();
const result = await loginWithGoogle(isSignup);
// result: { success, user, error, message }
```

### useGithubAuth()
```jsx
const { loginWithGithub, isLoading, error } = useGithubAuth();
const result = await loginWithGithub(isSignup);
// result: { success, user, error, message }
```

### useForgotPassword()
```jsx
const { requestPasswordReset, resetPassword, isLoading, error, success } = useForgotPassword();

// Request reset email
const result = await requestPasswordReset(email);

// Reset password (on reset-password page)
const result = await resetPassword(newPassword, confirmPassword);
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Generate strong JWT_SECRET
- [ ] Update CORS_ORIGIN to production frontend URL
- [ ] Enable HTTPS on both frontend and backend
- [ ] Configure Firebase security rules
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up email verification on signup
- [ ] Implement refresh token rotation
- [ ] Enable 2FA for admin accounts
- [ ] Monitor failed login attempts
- [ ] Setup error logging/monitoring

---

## 📊 User Data Structure

```js
// Stored in Zustand (localStorage)
{
  user: {
    uid: 'firebase_uid',
    email: 'user@example.com',
    displayName: 'John Doe',
    role: 'Creator',
    accountType: 'Creator',
  },
  isAuthenticated: true,
  userRole: 'Creator',
  token: 'firebase_id_token',
  rememberMe: false,
  loading: false,
  error: null,
}

// Stored in Firestore
{
  uid: 'firebase_uid',
  email: 'user@example.com',
  displayName: 'John Doe',
  role: 'Creator',
  accountType: 'Creator',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isEmailVerified: false,
  bio: 'Creator bio',
  profileImage: 'image_url',
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  socialLinks: {
    twitter: 'https://twitter.com/user',
    instagram: 'https://instagram.com/user',
    linkedin: 'https://linkedin.com/in/user',
  },
}

// Firebase JWT Claims
{
  role: 'Creator',  // Custom claim for fast role checks
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase is not initialized"
**Solution**: Check `VITE_FIREBASE_*` in `.env.local` and ensure `frontend/src/config/firebase.js` is imported

### Issue: CORS errors
**Solution**: Update `CORS_ORIGIN` in backend `.env` to match frontend URL

### Issue: Token not persisting after refresh
**Solution**: Verify `useAuthStore` uses Zustand persist middleware and localStorage is enabled

### Issue: Google/GitHub OAuth not working
**Solution**: 
- Add localhost URIs to Firebase OAuth allowed domains
- Check browser console for auth errors
- Ensure popup is not blocked by browser

### Issue: "Invalid email" errors
**Solution**: Ensure email format is valid in registration form validation

---

## 📚 File Quick Reference

| File | Purpose |
|------|---------|
| `backend/src/config/firebase.js` | Firebase Admin SDK initialization |
| `backend/src/middleware/authMiddleware.js` | Bearer token verification and role checking |
| `backend/src/controllers/authController.js` | Auth endpoint handlers |
| `backend/src/routes/authRoutes.js` | Auth API route definitions |
| `frontend/src/stores/authStore.js` | Zustand auth state management |
| `frontend/src/hooks/useAuth.js` | Main auth hook for consuming state/actions |
| `frontend/src/hooks/useLogin.js` | Email/password login logic |
| `frontend/src/auth/LoginForm.jsx` | Login form component |
| `frontend/src/pages/auth/Login.jsx` | Login page wrapper |
| `frontend/src/routes/ProtectedRoute.jsx` | Route guard component |

---

## 🆘 Need Help?

1. Check [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed setup guide
2. Review API endpoints documentation
3. Check browser DevTools → Console for errors
4. Check server logs for backend errors
5. Verify Firebase project configuration
6. Check `.env` variables are set correctly

---

**Happy Building! 🚀**
