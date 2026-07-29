import type { Config } from "tailwindcss";

// Design system: "Instrument".
//
// Ground is a deep petrol — a blue-green dark, not black and not navy. Warm
// bone type sits on top of it, and that warm-on-cool contrast is what stops the
// page reading like every other dark developer portfolio.
//
// Two accents, and they carry the hierarchy rather than decorating it:
//   amber — AI/ML, the primary track. Also marks anything with a source link.
//   aqua  — quantitative work, the secondary track.
// If something is amber it is either machine-learning work or evidence you can
// open. Colour means something here, so it is never spent freely.

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: "#10262E",
          2: "#16323C",
          3: "#0A1C22",
        },
        bone: {
          DEFAULT: "#F0E9DD",
          2: "#A8BCC0",
          3: "#8298A0",
        },
        rule: {
          DEFAULT: "#24434E",
          strong: "#335865",
        },
        amber: {
          DEFAULT: "#FFB870",
          lift: "#FFCB96",
          wash: "#2A3A38",
        },
        aqua: {
          DEFAULT: "#7BD3C0",
          lift: "#9CE2D2",
        },
      },
      fontFamily: {
        // Bodoni Moda: a true Didone, the same lineage as the Computer Modern
        // his LaTeX resume is set in. High contrast reads well reversed out.
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.16em" }],
        micro: ["0.625rem", { lineHeight: "1", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        shell: "1180px",
        prose: "62ch",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
