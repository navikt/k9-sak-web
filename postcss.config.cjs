require('tailwindcss');
require('autoprefixer');
require('postcss-import');

module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    "tailwindcss": {},
    "autoprefixer": {},
  }
}
