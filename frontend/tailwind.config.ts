import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 48px rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
