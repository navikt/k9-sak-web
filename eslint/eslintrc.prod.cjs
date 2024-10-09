const common = require('./eslintrc.common.cjs');

const ON = 1;
const ERROR = 2;

// Merge common rules into prod rules
const rules = {
  ...common.rules,
  'no-console': ERROR, // <- Ser ikkje ut til å fungere, får berre warning uansett
  'import/no-extraneous-dependencies': ON,
};

// config will be common config with prod rules override
const config = {
  ...common,
  rules,
}

module.exports = config
