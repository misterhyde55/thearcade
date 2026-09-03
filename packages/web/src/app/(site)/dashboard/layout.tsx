"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Gauge,
  Gem,
  LayoutDashboard,
  Radio,
  ShieldCheck,
  Users,
  Video
} from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionKicker } from "@/components/ui/SectionKicker";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/stream-manager", label: "Stream Manager", icon: Radio },
  { href: "/dashboard/setup", label: "Stream Setup", icon: Gauge },
  { href: "/dashboard/content", label: "Content", icon: Video },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/monetization", label: "Monetization", icon: Gem },
  { href: "/dashboard/moderation", label: "Moderation & Safety", icon: ShieldCheck }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, signInAsCreator, creator } = useDemoSession();
  const pathname = usePathname();
  const { push } = useToast();
  const router = useRouter();

  if (role !== "creator" || !creator) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          icon={Radio}
          title="Creator dashboard requires a creator account"
          description="This prototype's dashboard is built around one demo creator, MisterHyde55, so every analytics and moderation screen has realistic data to show."
          action={
            <button
              onClick={() => {
                signInAsCreator();
                push({ kind: "success", title: "Signed in as MisterHyde55" });
                router.push("/dashboard");
              }}
              className="focus-ring rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red/90"
            >
              Continue as creator demo
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionKicker>OPERATOR CONSOLE</SectionKicker>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav
          aria-label="Dashboard sections"
          className="flex gap-1 overflow-x-auto rounded-lg border border-surface-border bg-surface-raised p-1.5 lg:flex-col lg:overflow-visible"
        >
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring flex shrink-0 items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-brand-red/40 bg-brand-red/10 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "border-transparent text-ink-muted hover:bg-surface-panel2 hover:text-ink"
                }`}
              >
                <item.icon size={16} className={active ? "text-brand-red" : undefined} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
