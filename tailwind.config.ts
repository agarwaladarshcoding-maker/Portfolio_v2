import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#13141a",
          deep: "#0e0f14",
          soft: "#1a1c24",
          line: "#262833",
        },
        bone: {
          DEFAULT: "#ece7dd",
          dim: "#b6b2a9",
          mute: "#7c7a74",
        },
        signal: {
          DEFAULT: "#ff5d3b",
          soft: "#ff7a5c",
        },
        mint: {
          DEFAULT: "#8fe7c4",
          dim: "#5bbf9b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        shell: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
