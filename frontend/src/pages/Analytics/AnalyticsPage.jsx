import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { api } from "../../services/api.js";

const heat = Array.from({ length: 7 * 8 }).map((_, i) => ({
  id: i,
  v: Math.max(0.15, Math.sin(i * 0.35) * 0.5 + Math.random() * 0.5),
}));

const COLORS = ["#38bdf8", "#a78bfa", "#fb923c", "#34d399"];

export default function AnalyticsPage() {
  const series = useQuery({
    queryKey: ["analytics-series"],
    queryFn: async () => (await api.get("/api/analytics/series")).data.data,
  });

  const audience = useQuery({
    queryKey: ["analytics-audience"],
    queryFn: async () => (await api.get("/api/analytics/audience")).data.data,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
          Growth, engagement, audience slices, and a heatmap-style activity lattice — exportable for brand decks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-4 lg:col-span-2">
          <div className="mb-3 px-2 text-sm font-semibold">Watch time / story performance</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series.data ?? []}>
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
                <Line type="monotone" dataKey="views" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="engagement" stroke="#fb923c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-4">
          <div className="mb-3 px-2 text-sm font-semibold">Geo audience (mock)</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={audience.data ?? []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {(audience.data ?? []).map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">Engagement heat lattice</div>
          <div className="text-xs text-[var(--vv-muted)]">Scroll-linked in product; static preview here</div>
        </div>
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-12 lg:grid-cols-14">
          {heat.map((h) => (
            <div
              key={h.id}
              className="aspect-square rounded-lg"
              style={{
                background: `rgba(56,189,248,${0.12 + h.v * 0.55})`,
                boxShadow: h.v > 0.75 ? "0 0 24px rgba(56,189,248,0.35)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
