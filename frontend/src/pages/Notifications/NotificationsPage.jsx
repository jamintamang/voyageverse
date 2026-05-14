import { motion } from "framer-motion";

const items = [
  { title: "Brand offer accepted", body: "Aurora Luggage confirmed deliverables timeline.", time: "2m ago", tone: "sky" },
  { title: "AI studio quota", body: "You’ve used 72% of your monthly generation budget.", time: "18m ago", tone: "amber" },
  { title: "New follower milestone", body: "10k followers on your VoyageVerse profile.", time: "1h ago", tone: "emerald" },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">Realtime channel ready (Socket.IO server is already bootstrapped).</p>
      </div>
      <div className="space-y-3">
        {items.map((n, i) => (
          <motion.div
            key={n.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-3xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="mt-1 text-sm text-[var(--vv-muted)]">{n.body}</div>
              </div>
              <div className="shrink-0 text-xs text-[var(--vv-muted)]">{n.time}</div>
            </div>
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${n.tone === "sky" ? "from-sky-500/60 to-indigo-500/20" : n.tone === "amber" ? "from-amber-400/60 to-orange-500/20" : "from-emerald-400/60 to-emerald-600/10"}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
