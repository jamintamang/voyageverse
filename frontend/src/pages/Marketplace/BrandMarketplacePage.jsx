import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function BrandMarketplacePage() {
  const { isBrand, isCreator } = useAuth();

  const offers = useQuery({
    queryKey: ["collab-offers"],
    queryFn: async () => (await api.get("/api/collaborations/offers")).data.data,
  });

  const discover = useQuery({
    queryKey: ["collab-discover"],
    queryFn: async () => (await api.get("/api/collaborations/discover")).data.data,
    enabled: isBrand,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Brand marketplace</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
          Creator inbox for offers; brand-side discovery is gated to Brand/Admin roles with analytics sharing hooks.
        </p>
      </div>

      {isBrand && (
        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-4 text-sm font-semibold">Discover creators</div>
          {discover.isError ? (
            <div className="text-sm text-red-300">Unable to load discovery (requires Brand/Admin token claims).</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(discover.data ?? []).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{c.handle}</div>
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-200">
                      score {(c.matchScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[var(--vv-muted)]">{c.niche}</div>
                  <button type="button" className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-2 text-sm font-semibold text-white">
                    Send proposal
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="glass-panel rounded-3xl p-6">
        <div className="mb-4 text-sm font-semibold">{isCreator ? "Your offers" : "Pipeline"}</div>
        <div className="space-y-3">
          {(offers.data ?? []).map((o) => (
            <div key={o.id} className="flex flex-col gap-2 rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">{o.title}</div>
                <div className="text-xs text-[var(--vv-muted)]">{o.brand}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--vv-muted)]">{o.status}</span>
                <span className="text-sm font-semibold text-emerald-300">{o.budget}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
