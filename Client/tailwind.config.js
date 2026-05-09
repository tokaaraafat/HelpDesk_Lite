/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 8px 30px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};