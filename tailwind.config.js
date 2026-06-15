/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#121212",
        accent: "#64ffda",
        "accent-dim": "rgba(100,255,218,0.15)",
        "text-primary": "#e0e0e0",
        "text-secondary": "rgba(224,224,224,0.7)",
        "card-bg": "#1e1e3a",
        "warm-red": "#ff6b6b",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "-apple-system", "sans-serif"],
      },
      animation: {
        jelly: "jelly 200ms ease-in-out",
        "menu-appear": "menuAppear 300ms ease-out forwards",
      },
      keyframes: {
        jelly: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.9)" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        menuAppear: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -50%) scale(0.3)",
          },
          to: {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
