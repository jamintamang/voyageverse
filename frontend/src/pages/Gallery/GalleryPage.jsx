import { motion } from "framer-motion";

const items = [
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80", h: "h-64" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80", h: "h-96" },
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80", h: "h-72" },
  { src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=900&q=80", h: "h-80" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80", h: "h-56" },
  { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=80", h: "h-72" },
];

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Media gallery</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
            Masonry layout with lazy-loaded tiles — wire to Firebase Storage + Cloudinary transforms for production CDN.
          </p>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-dashed border-[var(--vv-border)] bg-[var(--vv-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--vv-muted)] hover:border-sky-400/40"
        >
          Drag & drop upload
        </button>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((it, i) => (
          <motion.figure
            key={it.src}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 6) * 0.05 }}
            className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-[var(--vv-border)] bg-[var(--vv-surface)]"
          >
            <img src={it.src} alt="" loading="lazy" className={`w-full ${it.h} object-cover transition duration-700 hover:scale-[1.03]`} />
            <figcaption className="flex items-center justify-between px-4 py-3 text-xs text-[var(--vv-muted)]">
              <span>4K · Rec.709</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">reel</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
