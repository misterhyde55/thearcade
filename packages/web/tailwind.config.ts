import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0b0b0f",
          raised: "#131318",
          panel: "#17171d",
          panel2: "#1d1d25",
          border: "#2a2a34",
          borderStrong: "#3a3a47"
        },
        ink: {
          DEFAULT: "#f4f4f6",
          muted: "#a4a4b2",
          faint: "#6b6b78"
        },
        brand: {
          red: "#ff3b4e",
          magenta: "#e0339c",
          purple: "#8b5cf6",
          cyan: "#22d3ee"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(224,51,156,0.25), 0 0 24px -4px rgba(224,51,156,0.35)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(11,11,15,0) 0%, rgba(11,11,15,0.9) 85%), repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 40px)"
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" }
        }
      },
      animation: {
        "pulse-live": "pulse-live 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
