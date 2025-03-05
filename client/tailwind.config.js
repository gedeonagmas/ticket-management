/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        night: "rgb(77 78 78)",
        main: "#0a2351",
      },
      backgroundImage: {
        hero: "url('/gedi.jpg')",
        footer: "url('/img/footer-texture.png')",
      },
    },
    fontFamily: {
      roboto: ["Roboto Condensed", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
  darkMode: "class",
};
