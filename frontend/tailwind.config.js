/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rail: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          700: "#0369a1",
          900: "#082f49"
        }
      }
    }
  },
  plugins: []
};
