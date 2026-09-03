import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#0a0014",
          panel: "#150a26",
          panel2: "#1d0e33",
          border: "#3d1f66",
          cyan: "#00f6ff",
          magenta: "#ff2bd6",
          yellow: "#ffe400",
          green: "#39ff14",
          orange: "#ff7a00"
        }
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        neon: "0 0 6px currentColor, 0 0 18px currentColor",
        cabinet: "0 0 0 4px #000, 0 0 0 6px #3d1f66, 0 12px 30px rgba(0,0,0,0.6)"
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.9" }
        },
        scan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" }
        }
      },
      animation: {
        flicker: "flicker 4s infinite",
        scan: "scan 12s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
