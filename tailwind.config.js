/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./packages/**/*.{js,jsx,ts,tsx}', './public/client/index.html'],
  // eslint-disable-next-line global-require
  presets: [require('@navikt/ds-tailwind')],
  theme: {
    extend: {
      colors: { 'warning-yellow': '#ff9100' },
    },
    fontFamily: {
      sans: ['Source Sans Pro', 'Arial', 'sans-serif'],
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
