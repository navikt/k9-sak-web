/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./packages/**/*.{js,jsx,ts,tsx}', './public/client/index.html'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
