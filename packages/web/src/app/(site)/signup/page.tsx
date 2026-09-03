"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";
import { CREATORS } from "@/lib/mock-data";

type Step = "details" | "verify" | "creator-prompt";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("details");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInAsViewer, signInAsCreator } = useDemoSession();
  const { push } = useToast();
  const router = useRouter();

  const taken = CREATORS.some((c) => c.username.toLowerCase() === username.trim().toLowerCase());
  const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameValid || taken) return;
    setStep("verify");
  }

  function confirmVerified() {
    signInAsViewer();
    push({ kind: "success", title: "Email verified (demo)", description: "Your account is ready." });
    setStep("creator-prompt");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-center font-display text-2xl font-bold text-ink">Create your account</h1>
      <p className="mt-1 text-center text-sm text-ink-muted">Free forever for viewers. Creator tools included.</p>

      {step === "details" && (
        <form onSubmit={submitDetails} className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Username</span>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Letters, numbers, underscores"
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none"
            />
            {username.length > 0 && (
              <span className={`mt-1 flex items-center gap-1 text-xs ${usernameValid && !taken ? "text-brand-cyan" : "text-brand-red"}`}>
                {usernameValid && !taken ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {!usernameValid ? "3-20 characters, letters/numbers/underscores only" : taken ? "That username is already taken" : "Username available"}
              </span>
            )}
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Password</span>
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2.5 text-sm text-ink outline-none"
            />
            <span className="mt-1 block text-xs text-ink-faint">At least 8 characters.</span>
          </label>
          <button
            type="submit"
            disabled={!usernameValid || taken || !email || password.length < 8}
            className="focus-ring w-full rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90 disabled:opacity-50"
          >
            Create account
          </button>
        </form>
      )}

      {step === "verify" && (
        <div className="mt-6 space-y-4 text-center">
          <MailCheck size={30} className="mx-auto text-brand-cyan" />
          <p className="text-sm text-ink-muted">
            We&apos;d send a verification link to <span className="text-ink">{email || "your email"}</span>. No email service is connected in this
            prototype, so confirm manually to continue.
          </p>
          <button onClick={confirmVerified} className="focus-ring w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-surface hover:bg-ink/90">
            I've verified my email
          </button>
        </div>
      )}

      {step === "creator-prompt" && (
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-ink-muted">Want to broadcast too? Creator onboarding takes about two minutes.</p>
          <button
            onClick={() => {
              signInAsCreator();
              push({ kind: "info", title: "Creator demo unlocked", description: "Explore onboarding via the Dashboard checklist." });
              router.push("/dashboard");
            }}
            className="focus-ring w-full rounded-md bg-brand-red py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90"
          >
            Start creator onboarding
          </button>
          <button onClick={() => router.push("/")} className="focus-ring w-full rounded-md border border-surface-border py-2.5 text-sm font-medium text-ink-muted hover:text-ink">
            Skip for now, I'm just watching
          </button>
        </div>
      )}

      {step === "details" && (
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-cyan underline">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
