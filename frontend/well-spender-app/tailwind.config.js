/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors:{
        primary: "daf7a6",
        secondary: "f7d7a6",
      }
    }
  },
  plugins: [],
}

