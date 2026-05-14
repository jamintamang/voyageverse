import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Compass,
  Image as ImageIcon,
  LayoutDashboard,
  Map,
  Settings,
  Shield,
  Sparkles,
  Store,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase.js";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/journal", label: "Travel journal", icon: BookOpen },
  { to: "/map", label: "World map", icon: Map },
  { to: "/gallery", label: "Media gallery", icon: ImageIcon },
  { to: "/ai-studio", label: "AI studio", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/marketplace", label: "Brand collabs", icon: Store },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShellLayout() {
  const { user, userRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => {
    if (userRole === "Admin") {
      return [...links, { to: "/admin", label: "Admin", icon: Shield }];
    }
    return links;
  }, [userRole]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
    logout();
    nav("/");
  };

  return (
    <div className="min-h-full bg-[var(--vv-bg)] text-[var(--vv-text)]">
      <div className="flex min-h-screen">
        <aside className="relative hidden w-72 shrink-0 border-r border-[var(--vv-border)] bg-[color-mix(in_oklab,var(--vv-bg)_92%,white_2%)] px-4 py-6 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-400 to-orange-300">
              <Compass className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold">VoyageVerse</div>
              <div className="text-xs text-[var(--vv-muted)]">{userRole || "Creator"} workspace</div>
            </div>
          </div>

          <nav className="space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/15 text-sky-300"
                      : "text-[var(--vv-muted)] hover:bg-[var(--vv-surface)] hover:text-[var(--vv-text)]",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-6 left-4 right-4 space-y-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-3 py-2 text-left text-xs font-medium text-[var(--vv-muted)] transition hover:border-sky-400/40"
            >
              Theme: {theme === "dark" ? "Cinema dark" : "Daylight"}
            </button>
            <div className="glass-panel rounded-2xl p-3 text-xs text-[var(--vv-muted)]">
              <div className="font-medium text-[var(--vv-text)]">{user?.displayName || "Creator"}</div>
              <div className="truncate">{user?.email}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] px-4 py-3 lg:hidden">
            <div className="font-display text-sm font-semibold">VoyageVerse</div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--vv-border)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-[var(--vv-border)] bg-[var(--vv-bg)] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold">Menu</div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--vv-border)]"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                        isActive ? "bg-sky-500/15 text-sky-300" : "text-[var(--vv-muted)]",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
