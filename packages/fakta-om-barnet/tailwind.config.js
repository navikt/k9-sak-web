/* eslint-disable global-require */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('@navikt/ds-tailwind')],
  theme: {
    extend: {
      colors: { 'warning-yellow': '#ff9100' },
    },
    fontFamily: {
      sans: ['Source Sans Pro', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
