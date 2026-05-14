import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase.js";
import { useAuth } from "./hooks/useAuth.js";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import ProtectedRoute, { RoleProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { MarketingLayout } from "./layouts/MarketingLayout.jsx";
import { AppShellLayout } from "./layouts/AppShellLayout.jsx";

const HomePage = lazy(() => import("./pages/Home/HomePage.jsx"));
const ExplorePage = lazy(() => import("./pages/Explore/ExplorePage.jsx"));
const PublicProfilePage = lazy(() => import("./pages/Profile/PublicProfilePage.jsx"));

const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage.jsx"));
const JournalPage = lazy(() => import("./pages/Journal/JournalPage.jsx"));
const TravelMapPage = lazy(() => import("./pages/Map/TravelMapPage.jsx"));
const GalleryPage = lazy(() => import("./pages/Gallery/GalleryPage.jsx"));
const AIStudioPage = lazy(() => import("./pages/AI/AIStudioPage.jsx"));
const AnalyticsPage = lazy(() => import("./pages/Analytics/AnalyticsPage.jsx"));
const BrandMarketplacePage = lazy(() => import("./pages/Marketplace/BrandMarketplacePage.jsx"));
const SettingsPage = lazy(() => import("./pages/Settings/SettingsPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/Notifications/NotificationsPage.jsx"));
const AdminPage = lazy(() => import("./pages/Admin/AdminPage.jsx"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--vv-muted)]">
      Loading experience…
    </div>
  );
}

function App() {
  const { setUser, setToken, logout, setSessionResolved } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          const decodedToken = await firebaseUser.getIdTokenResult();
          const role = decodedToken.claims.role || "Creator";

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
            accountType: role,
          });
          setToken(idToken);
        } else {
          logout();
        }
      } finally {
        setSessionResolved(true);
      }
    });

    return unsubscribe;
  }, [setUser, setToken, logout, setSessionResolved]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/u/:username" element={<PublicProfilePage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShellLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/map" element={<TravelMapPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/ai-studio" element={<AIStudioPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/marketplace" element={<BrandMarketplacePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute roles={["Admin"]}>
                  <AdminPage />
                </RoleProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
