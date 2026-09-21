/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f172a",
        card: "#161f33",
        border: "#23304a",
        primary: {
          DEFAULT: "#e84142", // Avalanche Red
          hover: "#d03536",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Web3 Electric Purple
          hover: "#7c3aed",
        },
        accent: {
          DEFAULT: "#06b6d4", // Neon Cyan
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(232, 65, 66, 0.4)",
        "purple-glow": "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "cyan-glow": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
