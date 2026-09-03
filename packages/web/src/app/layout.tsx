import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CrtOverlay } from "@/components/CrtOverlay";
import { Navbar } from "@/components/Navbar";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel"
});

const monoFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "The Arcade — Live Retro Streaming",
  description: "Stream live games with a retro arcade vibe. Low-latency, ad-free, XP-powered chat."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-arcade-bg font-mono">
        <AuthProvider>
          <CrtOverlay />
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
