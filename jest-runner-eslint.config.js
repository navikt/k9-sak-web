const OFF = 0;
const ERROR = 2;

module.exports = {
  cliOptions: {
    cache: true,
    rules: {
      'no-unused-expressions': OFF,
      'no-debugger': ERROR,
      'no-console': ERROR,
      'import/no-extraneous-dependencies': OFF,
    },
  },
};
