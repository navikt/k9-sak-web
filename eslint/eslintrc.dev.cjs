const { merge } = require('webpack-merge');
const common = require('./eslintrc.common.cjs');

const OFF = 0;
const WARN = 1;

const config = {
  rules: {
    'no-debugger': OFF,
    'no-console': WARN,
    'import/no-extraneous-dependencies': OFF,
    '@typescript-eslint/no-unused-vars': WARN,
  },
};

module.exports = merge(common, config);
