/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-headers": "var(--primary-headers)",
        "primary-headers-darker": "var(--primary-headers-darker)",
        "accept-color": "var(--accept-color)",
        "accept-color-darker": "var(--accept-color-darker)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
