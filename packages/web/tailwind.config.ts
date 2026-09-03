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
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "var(--font-display)", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(224,51,156,0.25), 0 0 24px -4px rgba(224,51,156,0.35)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        "cabinet-light": "0 0 0 2px rgba(255,59,78,0.35), 0 0 14px 2px rgba(255,59,78,0.55)",
        "button-cap": "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 2px rgba(0,0,0,0.35), 0 3px 0 rgba(0,0,0,0.45)",
        "button-cap-pressed": "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 2px 3px rgba(0,0,0,0.5)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(11,11,15,0) 0%, rgba(11,11,15,0.9) 85%), repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 40px)"
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" }
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "8%": { opacity: "0.55" },
          "9%": { opacity: "1" },
          "24%": { opacity: "0.85" },
          "25%": { opacity: "1" },
          "62%": { opacity: "0.4" },
          "63%": { opacity: "1" }
        },
        sweep: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" }
        },
        "coin-drop": {
          "0%": { transform: "translateY(-140%) rotate(0deg)", opacity: "0" },
          "15%": { opacity: "1" },
          "70%": { transform: "translateY(0%) rotate(360deg)", opacity: "1" },
          "85%": { transform: "translateY(-6%) rotate(400deg)" },
          "100%": { transform: "translateY(0%) rotate(420deg)", opacity: "1" }
        },
        "screen-flash": {
          "0%": { opacity: "0" },
          "12%": { opacity: "0.9" },
          "100%": { opacity: "0" }
        },
        "zoom-through": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" }
        }
      },
      animation: {
        "pulse-live": "pulse-live 1.6s ease-in-out infinite",
        blink: "blink 1.1s step-start infinite",
        flicker: "flicker 6s ease-in-out infinite",
        sweep: "sweep 5.5s ease-in-out infinite",
        "coin-drop": "coin-drop 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards",
        "screen-flash": "screen-flash 0.5s ease-out forwards",
        "zoom-through": "zoom-through 0.55s cubic-bezier(0.5, 0, 0.75, 0) forwards"
      }
    }
  },
  plugins: []
};

export default config;
