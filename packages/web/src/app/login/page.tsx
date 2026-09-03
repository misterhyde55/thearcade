"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, errorMessage } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(usernameOrEmail, password);
      router.push("/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border-2 border-arcade-border bg-arcade-panel p-6 shadow-cabinet">
        <h1 className="text-center font-pixel text-lg text-neon-cyan">CONTINUE?</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Username or email</label>
            <input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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
            />
          </div>
          {error && <p className="font-mono text-sm text-arcade-orange">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded border-2 border-arcade-cyan bg-arcade-cyan/10 py-2 font-pixel text-xs text-neon-cyan hover:bg-arcade-cyan/20 disabled:opacity-50"
          >
            {busy ? "LOADING..." : "PRESS START"}
          </button>
        </form>
        <p className="mt-4 text-center font-mono text-sm text-arcade-cyan/60">
          New here?{" "}
          <Link href="/register" className="text-neon-magenta underline">
            Insert coin
          </Link>
        </p>
      </div>
    </div>
  );
}
