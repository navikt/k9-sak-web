/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./packages/**/*.{js,jsx,ts,tsx}', './public/client/index.html'],
    // eslint-disable-next-line global-require
    presets: [require('@navikt/ds-tailwind')],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
