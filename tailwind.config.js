/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f97316", // orange-600
        secondary: "#0284c7", // blue-600
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
