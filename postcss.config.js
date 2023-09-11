const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const path = require('path');

module.exports = {
  plugins: [postcssImport, tailwindcss(path.join(__dirname, 'tailwind.config.js')), autoprefixer],
};
