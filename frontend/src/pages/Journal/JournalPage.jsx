import { useState } from "react";
import { motion } from "framer-motion";

const categories = ["Adventure", "Food", "Culture", "Hiking", "Solo travel", "Luxury", "Nature", "Road trips"];

const drafts = [
  { title: "Blue hour in Lisbon", mood: "Nostalgic", cat: "Culture", excerpt: "Tram sparks against cobblestones — the city teaches you tempo." },
  { title: "Dust, heat, and choir practice", mood: "Warm", cat: "Road trips", excerpt: "Somewhere between two gas stations, the horizon became a friend." },
];

export default function JournalPage() {
  const [active, setActive] = useState("Adventure");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Travel journal</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
            Markdown-ready editor surface (TipTap / MDX integration ready). Mood tags, geo, and animated story cards.
          </p>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20"
        >
          New story
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              active === c ? "border-sky-400/60 bg-sky-500/15 text-sky-200" : "border-[var(--vv-border)] bg-[var(--vv-surface)] text-[var(--vv-muted)] hover:border-sky-400/30",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {drafts.map((d, i) => (
          <motion.article
            key={d.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center justify-between text-xs text-[var(--vv-muted)]">
              <span>{d.cat}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{d.mood}</span>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{d.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--vv-muted)]">{d.excerpt}</p>
            <div className="mt-4 h-28 rounded-2xl border border-dashed border-[var(--vv-border)] bg-black/10 text-xs text-[var(--vv-muted)] flex items-center justify-center">
              Rich text canvas
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
