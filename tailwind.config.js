/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1D0F5A",
        lightNavy: "#2A1580",
        red: "#FF1E1E",
        lightRed: "#FF5252"
      }
    },
  },
  plugins: [],
}