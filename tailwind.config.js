/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "wide": "1480px",
        "wide1480": "1480px",
        "wide1680": "1680px",
      },
    },
  },
  plugins: [],
};

export default config;
