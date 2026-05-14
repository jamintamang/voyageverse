import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Quote, ShieldCheck, Wand2 } from "lucide-react";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "../../animations/variants.js";
import { useLenis } from "../../hooks/useLenis.js";

const creators = [
  { name: "Lina Ortiz", tag: "Solo hiking · 35mm", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80" },
  { name: "Kai Nakamura", tag: "Aerial storyteller", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80" },
  { name: "Mara Ellison", tag: "Luxury slow travel", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" },
];

const stories = [
  { title: "Night ferry to Valletta", meta: "Mediterranean · 6 min read", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=80" },
  { title: "Desert silence, stereo wide", meta: "Namibia · Film log", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80" },
  { title: "Monsoon market rhythm", meta: "Kerala · Sound diary", img: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=900&q=80" },
];

const testimonials = [
  { quote: "VoyageVerse is the first tool that treats my portfolio like a film, not a template.", who: "Elena V. · Director" },
  { quote: "Brands finally see the journey—not just the impressions.", who: "Noah P. · Travel creator" },
];

export default function HomePage() {
  useLenis(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div className="relative overflow-hidden">
      <section ref={heroRef} className="relative min-h-[92vh] overflow-hidden">
        <motion.video
          style={{ y }}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-at-sunset-34512-large.mp4"
            type="video/mp4"
          />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--vv-bg)]/20 via-[var(--vv-bg)]/70 to-[var(--vv-bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),transparent_55%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center gap-10 px-4 pb-24 pt-28 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:pb-32 lg:pt-36">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl space-y-8"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--vv-border)] bg-[var(--vv-surface)] px-3 py-1 text-xs font-medium text-[var(--vv-muted)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
              Personal branding for travel storytellers
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-gradient">Cinematic</span> profiles.{" "}
              <span className="text-[var(--vv-text)]">Living maps.</span>{" "}
              <span className="text-gradient">AI</span> that sounds like you.
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-[var(--vv-muted)] sm:text-lg">
              VoyageVerse unifies portfolio, travel journal, link-in-bio, media gallery, and brand collabs—wrapped in
              motion-rich UI inspired by the best modern consumer products.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_80px_rgba(56,189,248,0.35)] transition hover:brightness-110"
              >
                <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition group-hover:translate-x-[120%] duration-700" />
                <span className="relative">Launch your universe</span>
                <ArrowRight className="relative h-4 w-4" />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-5 py-3 text-sm font-semibold text-[var(--vv-text)] transition hover:border-sky-400/40"
              >
                <Play className="h-4 w-4" />
                Explore creators
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 text-xs text-[var(--vv-muted)]">
              <div>
                <div className="font-display text-lg font-semibold text-[var(--vv-text)]">120ms</div>
                interaction budget
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[var(--vv-text)]">4.9★</div>
                creator satisfaction (beta)
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[var(--vv-text)]">∞</div>
                stories waiting
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md lg:ml-auto"
          >
            <div className="gradient-border glass-panel relative overflow-hidden rounded-3xl p-[1px] shadow-[0_40px_120px_rgba(15,23,42,0.65)]">
              <div className="rounded-3xl bg-[color-mix(in_oklab,var(--vv-bg)_55%,transparent)] p-5">
                <div className="mb-4 flex items-center justify-between text-xs text-[var(--vv-muted)]">
                  <span>Live surface</span>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    synced
                  </span>
                </div>
                <div className="space-y-3">
                  {["Journey replay", "AI tone lock", "Brand-safe analytics"].map((label) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-3 py-2 text-sm">
                      <span>{label}</span>
                      <ShieldCheck className="h-4 w-4 text-sky-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-[var(--vv-border)] p-4 text-xs text-[var(--vv-muted)]">
                  Mapbox · Leaflet · Firebase · OpenAI embeddings — architected like a real SaaS control plane.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[var(--vv-border)] bg-[color-mix(in_oklab,var(--vv-bg)_88%,white_4%)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Featured creators</h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--vv-muted)]">Curated motion cards — Behance energy, Instagram immediacy.</p>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-sky-400 hover:text-sky-300">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {creators.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--vv-border)] bg-[var(--vv-surface)]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--vv-bg)] via-transparent to-transparent opacity-80" />
                <img src={c.img} alt="" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-display text-lg font-semibold">{c.name}</div>
                  <div className="text-xs text-[var(--vv-muted)]">{c.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Travel stories</h2>
            <p className="mt-2 text-sm text-[var(--vv-muted)]">Long-form, cinematic, and timeline-aware — Pinterest boards meet editorial design.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {stories.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
                className="glass-panel overflow-hidden rounded-3xl"
              >
                <img src={s.img} alt="" className="h-48 w-full object-cover" />
                <div className="space-y-2 p-5">
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="text-xs text-[var(--vv-muted)]">{s.meta}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="border-y border-[var(--vv-border)] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--vv-border)] bg-[var(--vv-surface)] px-3 py-1 text-xs font-medium text-[var(--vv-muted)]">
              <Wand2 className="h-3.5 w-3.5 text-sky-400" />
              AI creator studio
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Captions, bios, hashtags, and story beats — in your voice.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--vv-muted)]">
              OpenAI-powered tools with optional embeddings for semantic discovery, similarity search, and personalized recommendations.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--vv-muted)]">
              {[
                "Cinematic caption writer",
                "Travel diary co-author",
                "Hashtag clusters tuned for reach",
                "Brand pitch drafts with guardrails",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              Try AI studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="relative space-y-4 text-sm">
              <div className="rounded-2xl border border-[var(--vv-border)] bg-black/20 p-4 font-mono text-xs text-sky-100/90">
                <div className="text-[10px] uppercase tracking-[0.2em] text-sky-300/80">Prompt</div>
                <div className="mt-2">“Generate cinematic caption for Nepal mountain journey”</div>
              </div>
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-50">
                <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/80">Output</div>
                <div className="mt-2 leading-relaxed">
                  The ridge exhales. Clouds spill like silk across an ocean of stone — and for a moment, you are not
                  climbing; you are being introduced.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Analytics that feel alive</h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--vv-muted)]">Recharts dashboards, heatmaps, and growth curves — glassmorphism native.</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { label: "Profile visits", value: "8420", delta: "+12.4%" },
              { label: "Engagement", value: "6.8%", delta: "+0.6pts" },
              { label: "Brand requests", value: "14", delta: "3 new" },
            ].map((m) => (
              <div key={m.label} className="glass-panel rounded-3xl p-6">
                <div className="text-xs text-[var(--vv-muted)]">{m.label}</div>
                <div className="mt-3 font-display text-3xl font-semibold">{m.value}</div>
                <div className="mt-2 text-xs font-medium text-emerald-300">{m.delta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--vv-border)] bg-[color-mix(in_oklab,var(--vv-bg)_90%,white_3%)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Brand collaborations</h2>
            <p className="mt-2 text-sm text-[var(--vv-muted)]">
              Discovery, proposals, contracts, and analytics sharing — built for the creator economy, not spreadsheets.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-panel rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">For brands</h3>
              <p className="mt-2 text-sm text-[var(--vv-muted)]">Semantic search + embeddings-assisted creator matching.</p>
            </div>
            <div className="glass-panel rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">For creators</h3>
              <p className="mt-2 text-sm text-[var(--vv-muted)]">Offer inbox, negotiation timeline, deliverables tracking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.who}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel relative overflow-hidden rounded-3xl p-8"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-white/10" />
              <p className="relative text-lg leading-relaxed text-[var(--vv-text)]">“{t.quote}”</p>
              <div className="relative mt-6 text-sm text-[var(--vv-muted)]">{t.who}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-[var(--vv-border)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Pricing</h2>
            <p className="mt-2 text-sm text-[var(--vv-muted)]">Start free, scale like a premium SaaS.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: "Explorer", price: "$0", desc: "Link-in-bio, journal basics, community templates." },
              { name: "Creator", price: "$29", desc: "AI studio, analytics, gallery, map timelines.", highlight: true },
              { name: "Studio+", price: "$79", desc: "Brand collabs, contract vault, priority AI, admin seats." },
            ].map((p) => (
              <div
                key={p.name}
                className={[
                  "relative overflow-hidden rounded-3xl border p-6",
                  p.highlight
                    ? "border-sky-400/40 bg-gradient-to-b from-sky-500/15 to-indigo-500/10 shadow-[0_30px_120px_rgba(56,189,248,0.18)]"
                    : "border-[var(--vv-border)] bg-[var(--vv-surface)]",
                ].join(" ")}
              >
                {p.highlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Popular
                  </div>
                )}
                <div className="text-sm text-[var(--vv-muted)]">{p.name}</div>
                <div className="mt-3 font-display text-4xl font-semibold">{p.price}</div>
                <div className="mt-3 text-sm text-[var(--vv-muted)]">{p.desc}</div>
                <Link
                  to="/register"
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                    p.highlight
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:brightness-110"
                      : "border border-[var(--vv-border)] bg-[var(--vv-bg)] hover:border-sky-400/40",
                  ].join(" ")}
                >
                  Choose {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--vv-border)] py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="font-display text-sm font-semibold">VoyageVerse</div>
            <div className="mt-1 text-xs text-[var(--vv-muted)]">© {new Date().getFullYear()} VoyageVerse. Crafted for creators.</div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--vv-muted)]">
            <Link to="/login" className="hover:text-[var(--vv-text)]">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-[var(--vv-text)]">
              Create account
            </Link>
            <a href="https://openai.com" className="hover:text-[var(--vv-text)]" target="_blank" rel="noreferrer">
              OpenAI
            </a>
            <a href="https://firebase.google.com" className="hover:text-[var(--vv-text)]" target="_blank" rel="noreferrer">
              Firebase
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
