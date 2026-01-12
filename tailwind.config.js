/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cftc: {
          blue: '#003D7A',
          red: '#E63946',
          green: '#2A9D8F',
        }
      }
    },
  },
  plugins: [],
}
