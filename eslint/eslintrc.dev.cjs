const common = require('./eslintrc.common.cjs');

const OFF = 0;
const WARN = 1;

// Merge common rules into dev rules
const rules = {
  ...common.rules,
  'no-debugger': OFF,
  'no-console': WARN,
  'import/no-extraneous-dependencies': OFF,
  '@typescript-eslint/no-unused-vars': WARN,
};

// config will be common config with dev rules override
const config = {
  ...common,
  rules,
}

module.exports = config
