import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#5a8cff",
          500: "#3366ff",
          600: "#1f47e6",
          700: "#1736b4",
          800: "#172e8c",
          900: "#172c6e",
        },
        ink: {
          900: "#0b1020",
          700: "#1c2438",
          500: "#475067",
          300: "#8b93a7",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 10px 30px rgba(16,24,40,0.08)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
