"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-arcade-border bg-arcade-panel/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-pixel text-lg text-neon-cyan tracking-wide animate-flicker">
          THE ARCADE
        </Link>

        <div className="hidden items-center gap-6 font-mono text-sm text-arcade-cyan/80 sm:flex">
          <Link href="/" className="hover:text-neon-cyan">
            Browse
          </Link>
          <Link href="/categories" className="hover:text-neon-cyan">
            Cabinets
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded border-2 border-arcade-border bg-arcade-panel2 px-3 py-1.5 font-mono text-sm text-arcade-yellow hover:border-arcade-yellow"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: user.avatarColor }}
                />
                {user.username}
                <span className="text-xs text-arcade-magenta">Lv.{user.level}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded border-2 border-arcade-border bg-arcade-panel2 font-mono text-sm shadow-cabinet">
                  <Link
                    href={`/${user.username}`}
                    className="block px-4 py-2 text-arcade-cyan hover:bg-arcade-border/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    My channel
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-arcade-cyan hover:bg-arcade-border/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-arcade-orange hover:bg-arcade-border/40"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded border-2 border-arcade-border px-3 py-1.5 font-mono text-sm text-arcade-cyan hover:border-arcade-cyan"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded border-2 border-arcade-magenta bg-arcade-magenta/10 px-3 py-1.5 font-mono text-sm text-neon-magenta hover:bg-arcade-magenta/20"
              >
                Insert Coin
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
