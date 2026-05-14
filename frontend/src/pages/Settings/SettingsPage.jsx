import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../context/ThemeContext.jsx";

const schema = z.object({
  displayName: z.string().min(2).max(80),
  username: z.string().min(3).max(32),
});

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName || "",
      username: user?.email?.split("@")[0] || "creator",
    },
  });

  const onSave = (values) => {
    updateUserProfile({ displayName: values.displayName });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">Profile, security, and theme — React Hook Form + Zod.</p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="glass-panel space-y-5 rounded-3xl p-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Display name</label>
          <input {...register("displayName")} className="mt-2 w-full rounded-2xl border border-[var(--vv-border)] bg-black/20 px-4 py-3 text-sm outline-none focus:border-sky-400/50" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--vv-muted)]">Username (link-in-bio)</label>
          <input {...register("username")} className="mt-2 w-full rounded-2xl border border-[var(--vv-border)] bg-black/20 px-4 py-3 text-sm outline-none focus:border-sky-400/50" />
        </div>
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white">
          Save changes
        </button>
      </form>

      <div className="glass-panel rounded-3xl p-6">
        <div className="text-sm font-semibold">Appearance</div>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">Dark/light palettes tuned for glass surfaces.</p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-4 rounded-2xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-sm font-semibold"
        >
          Toggle theme ({theme})
        </button>
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <div className="text-sm font-semibold">Phone OTP (Firebase)</div>
        <p className="mt-2 text-sm text-[var(--vv-muted)]">
          Wire `RecaptchaVerifier` + `signInWithPhoneNumber` here. This demo keeps email/social auth as the primary path.
        </p>
        <button type="button" disabled className="mt-4 rounded-2xl border border-[var(--vv-border)] px-4 py-2 text-sm font-semibold text-[var(--vv-muted)]">
          Verify phone (soon)
        </button>
      </div>
    </div>
  );
}
