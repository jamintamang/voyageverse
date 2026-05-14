import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";

const people = [
  { handle: "linatrails", niche: "Solo hiking + 35mm", score: 0.93, cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80" },
  { handle: "kai.drone", niche: "Luxury aerials", score: 0.9, cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80" },
  { handle: "mara.slow", niche: "Editorial travel", score: 0.88, cover: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80" },
  { handle: "noahframes", niche: "Run-and-gun documentary", score: 0.86, cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80" },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Explore creators</h1>
        <p className="mt-3 text-sm text-[var(--vv-muted)]">
          Semantic discovery preview — powered by embeddings search in production.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <motion.div
            key={p.handle}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
            className="group relative overflow-hidden rounded-3xl border border-[var(--vv-border)] bg-[var(--vv-surface)]"
          >
            <img src={p.cover} alt="" className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-semibold">@{p.handle}</div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  match {(p.score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--vv-muted)]">
                <MapPin className="h-3.5 w-3.5" />
                {p.niche}
              </div>
              <Link
                to={`/u/${p.handle}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
              >
                <Sparkles className="h-4 w-4" />
                View link-in-bio
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
