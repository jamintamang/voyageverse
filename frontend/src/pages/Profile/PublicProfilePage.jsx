import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Camera, Clapperboard, Globe2, Sparkles } from "lucide-react";

export default function PublicProfilePage() {
  const { username } = useParams();

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-sky-400 via-indigo-400 to-orange-300 shadow-[0_20px_80px_rgba(56,189,248,0.35)]" />
            <div>
              <div className="font-display text-2xl font-semibold">@{username}</div>
              <div className="text-sm text-[var(--vv-muted)]">Travel filmmaker · VoyageVerse</div>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[var(--vv-muted)]">
            Link-in-bio surface: featured drops, embedded reels, donation/support links, and a live map preview — all themeable.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              { label: "Latest film: “Driftlines”", href: "#" },
              { label: "Presets + LUTs pack", href: "#" },
              { label: "Book a brand collab", href: "/marketplace" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-3 text-sm font-semibold transition hover:border-sky-400/40"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  {item.label}
                </span>
                <span className="text-xs text-[var(--vv-muted)] transition group-hover:text-[var(--vv-text)]">Open</span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-[var(--vv-muted)]">
            <a className="inline-flex items-center gap-2 text-sm hover:text-[var(--vv-text)]" href="https://instagram.com" target="_blank" rel="noreferrer">
              <Camera className="h-4 w-4" /> Instagram
            </a>
            <a className="inline-flex items-center gap-2 text-sm hover:text-[var(--vv-text)]" href="https://youtube.com" target="_blank" rel="noreferrer">
              <Clapperboard className="h-4 w-4" /> YouTube
            </a>
            <Link className="inline-flex items-center gap-2 text-sm hover:text-[var(--vv-text)]" to="/explore">
              <Globe2 className="h-4 w-4" /> Explore creators
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
