import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teal: {
          DEFAULT: "#06d6a0",
          50: "#e6fcf5",
          100: "#c3f9e5",
          500: "#06d6a0",
          600: "#05b386",
        },
        blue: {
          DEFAULT: "#118ab2",
          50: "#e7f5fa",
          500: "#118ab2",
        },
        purple: {
          DEFAULT: "#7b2ff7",
          500: "#7b2ff7",
        },
        red: {
          DEFAULT: "#ef476f",
          500: "#ef476f",
        },
        yellow: {
          DEFAULT: "#ffd166",
          500: "#ffd166",
        },
      },
    },
  },
  plugins: [],
};
export default config;
