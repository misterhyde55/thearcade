"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Radio, Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";
import { NotificationsMenu } from "./NotificationsMenu";
import { MessagesMenu } from "./MessagesMenu";
import { ProfileMenu } from "./ProfileMenu";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/following", label: "Player Favorites" }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isSignedIn, role, signInAsCreator } = useDemoSession();
  const { push } = useToast();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    router.push(`/browse?q=${encodeURIComponent(searchValue.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
  }

  function handleGoLive() {
    if (role === "creator") {
      router.push("/dashboard/stream-manager");
      return;
    }
    if (role === "viewer") {
      signInAsCreator();
      push({
        kind: "info",
        title: "Switched to creator demo",
        description: "Signed in as MisterHyde55 so you can preview the stream manager."
      });
      router.push("/dashboard/stream-manager");
      return;
    }
    push({ kind: "warning", title: "Sign in required", description: "Log in or create an account to go live." });
    router.push("/login");
  }

  function handleDashboard(e: React.MouseEvent) {
    if (role === "creator") return;
    e.preventDefault();
    if (role === "viewer") {
      signInAsCreator();
      push({ kind: "info", title: "Switched to creator demo", description: "Opening the dashboard as MisterHyde55." });
      router.push("/dashboard");
      return;
    }
    push({ kind: "warning", title: "Sign in required", description: "Log in to access the creator dashboard." });
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="focus-ring rounded-md p-2 text-ink-muted hover:bg-surface-panel2 lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="mr-2 shrink-0 font-display text-lg font-bold tracking-tight text-ink">
          THE <span className="text-gradient-brand">ARCADE</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={categoriesOpen}
              className="focus-ring flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink"
            >
              Categories <ChevronDown size={14} />
            </button>
            {categoriesOpen && (
              <>
                <button aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setCategoriesOpen(false)} tabIndex={-1} />
                <div className="absolute left-0 z-40 mt-2 grid w-[30rem] grid-cols-2 gap-1 rounded-lg border border-surface-border bg-surface-panel p-2 shadow-card">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="focus-ring flex items-center justify-between rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink"
                    >
                      {c.name}
                      <span className="text-xs text-ink-faint">{c.liveChannelCount} live</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <Link
            href="/browse"
            className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink"
          >
            Now Playing
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} role="search" className="flex items-center">
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => !searchValue && setSearchOpen(false)}
                  placeholder="Search creators, titles, categories…"
                  aria-label="Search The Arcade"
                  className="focus-ring w-64 rounded-md border border-surface-border bg-surface-raised py-1.5 pl-3 pr-8 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
                <button type="submit" aria-label="Submit search" className="absolute right-2 text-ink-faint hover:text-ink">
                  <Search size={15} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="focus-ring rounded-md p-2 text-ink-muted hover:bg-surface-panel2 hover:text-ink"
              >
                <Search size={19} />
              </button>
            )}
          </div>

          {isSignedIn && <NotificationsMenu />}
          {isSignedIn && <MessagesMenu />}

          <Link
            href="/dashboard"
            onClick={handleDashboard}
            className="focus-ring hidden rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink md:block"
          >
            Dashboard
          </Link>

          <button
            onClick={handleGoLive}
            className="arcade-button focus-ring hidden items-center gap-1.5 rounded-md bg-brand-red px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-red/90 sm:flex"
          >
            <Radio size={15} /> Go Live
          </button>

          {isSignedIn ? (
            <ProfileMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="focus-ring rounded-md bg-brand-magenta px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-surface-border bg-surface px-4 pb-4 pt-2 lg:hidden">
          <form onSubmit={submitSearch} role="search" className="relative mb-3 mt-2">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search creators, titles, categories…"
              aria-label="Search The Arcade"
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised py-2 pl-3 pr-9 text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            <button type="submit" aria-label="Submit search" className="absolute right-3 top-2.5 text-ink-faint">
              <Search size={16} />
            </button>
          </form>
          <div className="flex flex-col gap-0.5">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="focus-ring rounded-md px-2 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink">
                {l.label}
              </Link>
            ))}
            <p className="mt-2 px-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Categories</p>
            <div className="grid grid-cols-2 gap-0.5">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="focus-ring rounded-md px-2 py-2 text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink">
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-surface-border pt-3">
              <Link href="/dashboard" onClick={(e) => { handleDashboard(e); setMobileOpen(false); }} className="focus-ring rounded-md px-2 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink">
                Creator Dashboard
              </Link>
              <button onClick={() => { handleGoLive(); setMobileOpen(false); }} className="arcade-button focus-ring flex items-center justify-center gap-1.5 rounded-md bg-brand-red px-3.5 py-2.5 text-sm font-semibold text-white">
                <Radio size={15} /> Go Live
              </button>
              {!isSignedIn && (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="focus-ring rounded-md border border-surface-border px-3.5 py-2.5 text-center text-sm font-medium text-ink hover:bg-surface-panel2">
                    Log In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="focus-ring rounded-md bg-brand-magenta px-3.5 py-2.5 text-center text-sm font-semibold text-white">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
