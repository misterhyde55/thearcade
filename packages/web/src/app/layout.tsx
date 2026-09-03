import type { Metadata } from "next";
import { Inter, Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DemoSessionProvider } from "@/lib/demo-session";
import { ToastProvider } from "@/components/ui/Toast";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
// Used sparingly — small section kickers and the entrance screen only, never
// body copy or anything that needs to stay comfortably readable at length.
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel" });

export const metadata: Metadata = {
  title: "The Arcade — Live Streaming Built for Creators",
  description:
    "Broadcast, chat, and grow with a streaming platform designed around transparent moderation, fair discovery, and a creator-first revenue split."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${pixel.variable}`}>
      <body className="min-h-screen bg-surface font-sans text-ink antialiased">
        <ToastProvider>
          <DemoSessionProvider>{children}</DemoSessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
