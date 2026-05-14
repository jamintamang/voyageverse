import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { api } from "../../services/api.js";

const tools = [
  { id: "caption", title: "Caption generator", endpoint: "/api/ai/caption" },
  { id: "hashtags", title: "Hashtag clusters", endpoint: "/api/ai/hashtags" },
  { id: "bio", title: "Bio builder", endpoint: "/api/ai/bio" },
  { id: "story", title: "Cinematic story", endpoint: "/api/ai/story" },
  { id: "embed", title: "Embedding probe", endpoint: "/api/ai/embed" },
];

export default function AIStudioPage() {
  const [active, setActive] = useState(tools[0]);
  const [prompt, setPrompt] = useState("Generate cinematic caption for Nepal mountain journey");
  const [tone, setTone] = useState("Poetic, confident, minimal emojis");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(active.endpoint, { prompt, tone });
      return res.data;
    },
    onSuccess: (data) => {
      if (typeof data.result === "string") setOutput(data.result);
      else setOutput(JSON.stringify(data.embedding ?? data, null, 2));
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">AI studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
          OpenAI routes live on `/api/ai/*` with Firebase-authenticated requests, Helmet-hardened Express, and rate limits.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="glass-panel rounded-3xl p-4 lg:col-span-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Tools</div>
          <div className="space-y-2">
            {tools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActive(t);
                  setOutput("");
                }}
                className={[
                  "flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition",
                  active.id === t.id ? "border-sky-400/50 bg-sky-500/10 text-sky-100" : "border-[var(--vv-border)] bg-[var(--vv-surface)] text-[var(--vv-muted)] hover:border-sky-400/30",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-sky-400" />
                  {t.title}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--vv-border)] p-3 text-xs text-[var(--vv-muted)]">
            If `OPENAI_API_KEY` is absent, the API returns curated mock output so the UI stays demo-ready.
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:col-span-8">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-[var(--vv-border)] bg-black/20 px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400/50"
          />

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Tone / constraints</label>
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--vv-border)] bg-black/20 px-4 py-3 text-sm outline-none focus:border-sky-400/50"
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.985 }}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:opacity-60"
          >
            {mutation.isPending ? "Generating…" : "Run model"}
          </motion.button>

          {mutation.isError && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {(mutation.error && mutation.error.message) || "Request failed"}
            </div>
          )}

          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Output</div>
            <pre className="mt-2 whitespace-pre-wrap rounded-2xl border border-[var(--vv-border)] bg-black/25 p-4 text-sm leading-relaxed text-[var(--vv-text)]">
              {output || "—"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
