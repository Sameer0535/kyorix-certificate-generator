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
        kyorix: {
          navy: {
            DEFAULT: "#0A1128",
            light: "#131F42",
            dark: "#050814",
            card: "#0F1A3A",
            border: "#1E2C52",
          },
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F3D279",
            dark: "#AA8214",
            accent: "#E5C04A",
            soft: "#FDF8E7",
          },
          slate: {
            surface: "#F8FAFC",
            border: "#E2E8F0",
            muted: "#64748B",
          }
        },
      },
    },
  },
  plugins: [],
};
export default config;

