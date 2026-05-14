import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Moon, Sparkles, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const nav = [
  { to: "/explore", label: "Explore" },
  { to: "/marketplace", label: "Collabs" },
  { to: "/#ai", label: "AI Studio" },
  { to: "/#pricing", label: "Pricing" },
];

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--vv-border)] bg-[color-mix(in_oklab,var(--vv-bg)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight">VoyageVerse</div>
            <div className="text-[11px] text-[var(--vv-muted)]">Creator branding OS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "text-sm font-medium transition-colors hover:text-sky-400",
                  isActive ? "text-sky-400" : "text-[var(--vv-muted)]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] text-[var(--vv-text)] transition hover:border-sky-400/40"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--vv-muted)] transition hover:text-[var(--vv-text)]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                Start free
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--vv-border)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[var(--vv-border)] bg-[var(--vv-bg)] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm">
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Start free
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
