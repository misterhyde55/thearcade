"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radio, Tv } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const { signInAsViewer, signInAsCreator } = useDemoSession();
  const { push } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    signInAsViewer();
    push({
      kind: "info",
      title: "Signed in (demo mode)",
      description: "Real email/password auth isn't wired to this prototype's mock creator data yet — you're in as a demo viewer."
    });
    router.push("/");
  }

  function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setResetSent(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-center font-display text-2xl font-bold text-ink">Log in to The Arcade</h1>

      <div className="mt-6 space-y-2 rounded-xl border border-surface-border bg-surface-panel p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Quick demo access</p>
        <button
          onClick={() => {
            signInAsViewer();
            push({ kind: "success", title: "Signed in as a viewer" });
            router.push("/");
          }}
          className="focus-ring flex w-full items-center gap-2.5 rounded-md border border-surface-border px-3.5 py-2.5 text-sm font-medium text-ink hover:border-brand-cyan/50"
        >
          <Tv size={16} className="text-brand-cyan" /> Continue as a viewer
        </button>
        <button
          onClick={() => {
            signInAsCreator();
            push({ kind: "success", title: "Signed in as MisterHyde55", description: "Full creator dashboard unlocked." });
            router.push("/dashboard");
          }}
          className="focus-ring flex w-full items-center gap-2.5 rounded-md border border-surface-border px-3.5 py-2.5 text-sm font-medium text-ink hover:border-brand-magenta/50"
        >
          <Radio size={16} className="text-brand-magenta" /> Continue as creator — MisterHyde55
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-surface-border" /> or <span className="h-px flex-1 bg-surface-border" />
      </div>

      {!forgotMode ? (
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Email or username</span>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none"
            />
          </label>
          <button type="button" onClick={() => setForgotMode(true)} className="focus-ring text-xs text-brand-cyan hover:underline">
            Forgot password?
          </button>
          <button type="submit" className="focus-ring w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-surface hover:bg-ink/90">
            Log in
          </button>
        </form>
      ) : (
        <form onSubmit={sendReset} className="space-y-3">
          {resetSent ? (
            <p className="rounded-md border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-2.5 text-sm text-brand-cyan">
              If an account matches that email, a reset link is on its way (simulated — no email service is connected yet).
            </p>
          ) : (
            <>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Email</span>
                <input required type="email" className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none" />
              </label>
              <button type="submit" className="focus-ring w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-surface hover:bg-ink/90">
                Send reset link
              </button>
            </>
          )}
          <button type="button" onClick={() => setForgotMode(false)} className="focus-ring text-xs text-ink-muted hover:text-ink">
            Back to log in
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-muted">
        New here?{" "}
        <Link href="/signup" className="text-brand-magenta underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
