/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "login-bg":
          "url('/src/img/pay-bills-mobile-banking-image_1108767.jpg')",
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ["dark"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
