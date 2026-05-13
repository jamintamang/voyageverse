# VoyageVerse Authentication - Complete Setup Guide

## 🎯 Current Status

✅ **Frontend**: Running on http://localhost:5174/  
✅ **Backend**: Running on http://localhost:3001/  
⏳ **Firebase**: Needs real credentials

---

## 🔧 Step 1: Setup Firebase

### 1.1 Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a Project"
3. Enter project name: `VoyageVerse` (or your preferred name)
4. Follow the setup wizard
5. Enable Email/Password, Google, and GitHub authentication

### 1.2 Download Service Account Key

1. In Firebase Console, go to **⚙️ Project Settings** (top-left)
2. Click **Service Accounts** tab
3. Click **"Generate New Private Key"**
4. A JSON file will download
5. Copy the entire contents

### 1.3 Add to Backend

1. Open `backend/src/config/serviceAccountKey.json`
2. Replace **ALL** content with the JSON you copied from Firebase
3. Save the file

**⚠️ IMPORTANT**: This file contains secret keys - NEVER commit it to GitHub!  
(It's already in `.gitignore`)

---

## 🔑 Step 2: Configure Environment Variables

### 2.1 Backend (.env)

File: `backend/.env`

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3001
FIREBASE_CONFIG_PATH=./src/config/serviceAccountKey.json
EMAIL_SERVICE=firebase
LOG_LEVEL=debug
```

**Already configured** ✅

### 2.2 Frontend (.env.local)

File: `frontend/.env.local`

Get these values from Firebase Console > Project Settings > Your Apps:

```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**How to find these values:**

1. Go to Firebase Console > Project Settings
2. Scroll to "Your apps" section
3. Under "Web apps", find your app
4. Click the settings icon or copy the config
5. Fill in the `.env.local` file

---

## 🚀 Step 3: Start Development Servers

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Server running on 3001
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:5174/
```

---

## 🧪 Step 4: Test the System

### Test Email/Password Registration

1. Open http://localhost:5174/register
2. Fill in the form:
   - Display Name: `John Doe`
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - Account Type: `Creator` or `Brand`
   - Check: "I agree to terms"
3. Click **Register**
4. Should redirect to `/dashboard`

### Test Login

1. Go to http://localhost:5174/login
2. Enter your registered email and password
3. Click **Login**
4. Should redirect to `/dashboard`

### Test Social Login (Optional)

1. Go to http://localhost:5174/login
2. Click **"Login with Google"** or **"Login with GitHub"**
3. Complete the OAuth flow

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/profile` | Update profile |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

**Test an endpoint:**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ID_TOKEN_HERE"
```

---

## 📊 User Data Flow

```
┌─────────────────────┐
│  React Frontend     │
│  (Vite + Firebase)  │
└──────────┬──────────┘
           │
           ├─→ Firebase Auth (email/password, OAuth)
           │
           ├─→ Get ID Token (with custom claims)
           │
           └─→ Send to Backend API
              
┌──────────────────────┐
│  Express Backend     │
│  (Node.js)           │
└──────────┬───────────┘
           │
           ├─→ Verify JWT with Firebase Admin SDK
           │
           ├─→ Check user role (Custom Claims)
           │
           ├─→ Update Firestore database
           │
           └─→ Return response

┌──────────────────────┐
│  Firebase Services   │
│  (Firestore, Auth)   │
└──────────────────────┘
```

---

## 🐛 Troubleshooting

### Firebase Credentials Error
```
❌ Firebase initialization failed: Failed to parse private key
```
**Solution:**
1. Download a fresh service account key from Firebase Console
2. Replace `backend/src/config/serviceAccountKey.json`
3. Restart backend: `npm run dev`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Check `CORS_ORIGIN` in `backend/.env`
2. Make sure frontend URL is included
3. Restart backend

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:**
1. Change PORT in `backend/.env` to an unused port
2. Or kill process: `lsof -ti:3001 | xargs kill -9` (macOS/Linux)

### Firebase Auth Not Working
```
Firebase is not initialized
```
**Solution:**
1. Check `frontend/.env.local` has correct Firebase credentials
2. Verify `VITE_FIREBASE_API_KEY` is not dummy value
3. Check Firebase Console project exists
4. Hard refresh browser (Ctrl+Shift+R)

---

## 📚 File Structure

```
VoyageVerse/
├── backend/
│   ├── .env                          (Environment variables)
│   ├── .env.example
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   ├── firebase.js           (Firebase Admin SDK)
│   │   │   └── serviceAccountKey.json (⚠️ Keep secret!)
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   ├── services/
│   │   │   └── userService.js
│   │   └── validators/
│   │       └── authValidator.js
│   └── package.json
│
├── frontend/
│   ├── .env.local                    (Firebase credentials)
│   ├── .env.example
│   ├── src/
│   │   ├── App.jsx
│   │   ├── config/
│   │   │   └── firebase.js           (Firebase SDK init)
│   │   ├── stores/
│   │   │   └── authStore.js          (Zustand store)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useLogin.js
│   │   │   ├── useRegister.js
│   │   │   ├── useGoogleAuth.js
│   │   │   ├── useGithubAuth.js
│   │   │   └── useForgotPassword.js
│   │   ├── auth/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── SocialLogin.jsx
│   │   ├── pages/auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   └── routes/
│   │       └── ProtectedRoute.jsx
│   └── package.json
│
├── SETUP_GUIDE.md                   (You are here!)
├── AUTH_SETUP.md
└── QUICK_START.md
```

---

## ✅ Checklist

Before considering setup complete:

- [ ] Firebase project created
- [ ] Service account key downloaded
- [ ] `serviceAccountKey.json` placed in `backend/src/config/`
- [ ] `backend/.env` configured
- [ ] `frontend/.env.local` configured with Firebase credentials
- [ ] Backend running: `npm run dev` (port 3001)
- [ ] Frontend running: `npm run dev` (port 5174)
- [ ] Can visit http://localhost:5174/register
- [ ] Can create an account
- [ ] Redirects to /dashboard after signup
- [ ] Can logout and login again

---

## 🎉 You're All Set!

Your VoyageVerse authentication system is ready! 

### Next Steps:
1. ✅ Complete setup (follow checklist above)
2. 🧪 Test authentication flows
3. 🎨 Customize styling as needed
4. 🚀 Deploy to production

### Resources:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Zustand Store](https://github.com/pmndrs/zustand)

---

**Questions?** Check [AUTH_SETUP.md](./AUTH_SETUP.md) or [QUICK_START.md](./QUICK_START.md)

**Happy coding! 🚀**
