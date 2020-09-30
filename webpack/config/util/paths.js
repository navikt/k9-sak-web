const path = require('path');

const resolvePath = (segment1, segment2) => path.resolve(segment1, segment2);

const ROOT_DIR = resolvePath(__dirname, '../../../public/client');
const CORE_DIR = resolvePath(__dirname, '../../../node_modules');
const PACKAGES_DIR = resolvePath(__dirname, '../../../packages');
const APP_DIR = resolvePath(PACKAGES_DIR, 'sak-app/src');
const LANG_DIR = resolvePath(__dirname, '../../../public/sprak/');
const CSS_DIR = resolvePath(PACKAGES_DIR, 'assets/styles');
const IMAGE_DIR = resolvePath(PACKAGES_DIR, 'assets/images');
const ESLINT_CONFIG_PATH = path.resolve(__dirname, '../../../eslint/eslintrc.test.js');

module.exports = {
  ROOT_DIR,
  CORE_DIR,
  PACKAGES_DIR,
  APP_DIR,
  LANG_DIR,
  CSS_DIR,
  IMAGE_DIR,
  ESLINT_CONFIG_PATH,
};
