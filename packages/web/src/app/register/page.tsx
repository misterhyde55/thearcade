"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, errorMessage } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(username, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border-2 border-arcade-border bg-arcade-panel p-6 shadow-cabinet">
        <h1 className="text-center font-pixel text-lg text-neon-magenta">INSERT COIN</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded border-2 border-arcade-border bg-arcade-bg px-3 py-2 font-mono text-white outline-none focus:border-arcade-cyan"
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Letters, numbers, and underscores only"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border-2 border-arcade-border bg-arcade-bg px-3 py-2 font-mono text-white outline-none focus:border-arcade-cyan"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border-2 border-arcade-border bg-arcade-bg px-3 py-2 font-mono text-white outline-none focus:border-arcade-cyan"
              required
              minLength={8}
            />
          </div>
          {error && <p className="font-mono text-sm text-arcade-orange">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded border-2 border-arcade-magenta bg-arcade-magenta/10 py-2 font-pixel text-xs text-neon-magenta hover:bg-arcade-magenta/20 disabled:opacity-50"
          >
            {busy ? "LOADING..." : "START GAME"}
          </button>
        </form>
        <p className="mt-4 text-center font-mono text-sm text-arcade-cyan/60">
          Already playing?{" "}
          <Link href="/login" className="text-neon-cyan underline">
            Continue
          </Link>
        </p>
      </div>
    </div>
  );
}
