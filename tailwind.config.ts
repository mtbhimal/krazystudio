import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0D",        // near-black base
        char: "#141319",       // charcoal surface
        char2: "#1C1A22",      // raised surface
        violet: "#e65c00",     // electric violet// i change for texting colour
        magenta: "#D6409F",    // magenta accent
        amber: "#E8A33D",      // analog-tape warm accent
        mist: "#B8B4C2",       // muted body text
        paper: "#F4F2F7"       // near-white headline text
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
        "glow-violet": "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.25), transparent 60%)"
      },
      keyframes: {
        waveform: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        waveform: "waveform 1.2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
