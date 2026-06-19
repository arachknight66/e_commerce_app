/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   "#6C63FF",
        secondary: "#FF6584",
        dark:      "#1A1A2E",
        card:      "#16213E",
        muted:     "#A0AEC0",
        success:   "#48BB78",
        warning:   "#ECC94B",
        danger:    "#FC8181",
        light:     "#F7FAFC",
      },
    },
  },
  plugins: [],
};
