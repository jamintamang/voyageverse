import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { api } from "../../services/api.js";
import { Sparkles, TrendingUp, Users, Eye, DollarSign, Mail } from "lucide-react";

export default function DashboardPage() {
  const overview = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await api.get("/api/analytics/overview")).data.data,
  });

  const series = useQuery({
    queryKey: ["analytics-series"],
    queryFn: async () => (await api.get("/api/analytics/series")).data.data,
  });

  const data = overview.data;

  const cards = [
    { label: "Total views", value: data?.totalViews?.toLocaleString() ?? "—", icon: Eye, accent: "from-sky-500/30 to-sky-500/5" },
    { label: "Engagement", value: data ? `${data.engagementRate}%` : "—", icon: TrendingUp, accent: "from-emerald-500/30 to-emerald-500/5" },
    { label: "Profile visits", value: data?.profileVisits?.toLocaleString() ?? "—", icon: Users, accent: "from-indigo-500/30 to-indigo-500/5" },
    { label: "Revenue (USD)", value: data ? `$${data.revenueUsd.toLocaleString()}` : "—", icon: DollarSign, accent: "from-orange-500/30 to-orange-500/5" },
    { label: "Brand requests", value: data?.brandRequests?.toString() ?? "—", icon: Mail, accent: "from-fuchsia-500/30 to-fuchsia-500/5" },
    { label: "AI content score", value: data ? `${data.aiContentScore}` : "—", icon: Sparkles, accent: "from-cyan-500/30 to-cyan-500/5" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">Glassmorphism overview — wired to `/api/analytics` with TanStack Query caching.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-panel relative overflow-hidden rounded-3xl p-5"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-[var(--vv-muted)]">{c.label}</div>
                <div className="mt-3 font-display text-2xl font-semibold">{c.value}</div>
              </div>
              <c.icon className="h-5 w-5 text-[var(--vv-muted)]" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between px-2">
            <div>
              <div className="text-sm font-semibold">Growth trend</div>
              <div className="text-xs text-[var(--vv-muted)]">Views vs engagement (7d)</div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              +{data?.growthPct ?? "—"}%
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#38bdf8" fill="url(#gViews)" strokeWidth={2} />
                <Area type="monotone" dataKey="engagement" stroke="#a78bfa" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-4">
          <div className="mb-3 px-2 text-sm font-semibold">Audience mix</div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: "Mobile", v: 62 }, { name: "Desktop", v: 24 }, { name: "Tablet", v: 14 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="name" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="#38bdf8" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 px-2 text-xs text-[var(--vv-muted)]">Device insights + geo heatmaps ship in Analytics.</p>
        </div>
      </div>
    </div>
  );
}
