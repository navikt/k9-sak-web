require('tailwindcss');
require('autoprefixer');
require('postcss-import');

module.exports = {
  plugins: {
    "postcss-import": {},
    "@tailwindcss/postcss": {},
    "autoprefixer": {},
  }
}
