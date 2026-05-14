import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api.js";

export default function AdminPage() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/api/admin/stats")).data.data,
    retry: false,
  });

  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/api/admin/users")).data.data,
    retry: false,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">User management, moderation, AI usage, revenue — gated by Admin custom claims.</p>
      </div>

      {stats.isError ? (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
          Admin endpoints require an Firebase ID token with <span className="font-mono">role: "Admin"</span>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Active users", value: stats.data?.activeUsers?.toLocaleString() ?? "—" },
            { label: "Flagged", value: stats.data?.flaggedContent ?? "—" },
            { label: "AI tokens (24h)", value: stats.data?.aiTokens24h ? `${(stats.data.aiTokens24h / 1e6).toFixed(1)}M` : "—" },
            { label: "MRR (USD)", value: stats.data?.mrrUsd ? `$${stats.data.mrrUsd.toLocaleString()}` : "—" },
          ].map((s) => (
            <div key={s.label} className="glass-panel rounded-3xl p-5">
              <div className="text-xs text-[var(--vv-muted)]">{s.label}</div>
              <div className="mt-3 font-display text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="border-b border-[var(--vv-border)] px-5 py-4 text-sm font-semibold">Users</div>
        {users.isError ? (
          <div className="p-5 text-sm text-[var(--vv-muted)]">No access.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[var(--vv-muted)]">
              <tr>
                <th className="px-5 py-3">UID</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(users.data ?? []).map((u) => (
                <tr key={u.uid} className="border-t border-[var(--vv-border)]">
                  <td className="px-5 py-3 font-mono text-xs">{u.uid}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">{u.role}</td>
                  <td className="px-5 py-3 text-emerald-300">{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
