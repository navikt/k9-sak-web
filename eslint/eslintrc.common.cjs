const OFF = 0;
const ERROR = 2;

const config = {
  env: {
    browser: true,
  },

  globals: {
    VERSION: 'off',
    vi: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: ['import', 'vitest', '@typescript-eslint'],

  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', "plugin:vitest/recommended", 'prettier'],

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      ecmaVersion: 2020,
      jsx: true,
      impliedStrict: true,
    },
  },

  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
      }
    }
  },

  rules: {
    // Disabled since unresolved imports will be detected by typescript and vite build. Also, couldn't get it to work when
    // importing typescript modules (ESM) exported from a package with the modern "exports" clause. (*.js extension problem)
    'import/no-unresolved': OFF,

    // import/no-cycle rule apparently started working when import/resolver was changed to typescript. It found lots of
    // existing problems, so disabled it for now.
    'import/no-cycle': OFF,
    // Disabled since we want to start using .js extensions when importing. Because that makes importing from packages
    // using a simple wildcard (/*) "exports" clause possible, and gives a better dx. Especially in VS Code, path lookup
    // from such packages works well then.
    'import/extensions': OFF,
    'linebreak-style': OFF,
    'import/no-named-as-default': OFF,
    'max-len': [1, 160],
    'no-undef': ERROR,
    'react/require-default-props': OFF,
    'react/jsx-filename-extension': OFF,
    'react/static-property-placement': OFF,
    'react/state-in-constructor': OFF,

    'function-paren-newline': OFF,
    'function-call-argument-newline': OFF,
    // Want to be able to use for ... of loops:
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'no-restricted-exports': OFF,
    // This rule got triggered even if the constructor was useful:
    'no-useless-constructor': OFF,
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.stories.tsx'] },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/prefer-default-export': OFF,

    // note you must disable the base rule as it can report incorrect errors
    'no-nested-ternary': OFF,
    'no-use-before-define': OFF,
    '@typescript-eslint/no-use-before-define': [ERROR],
    'no-shadow': OFF,
    '@typescript-eslint/no-shadow': [ERROR],
    'no-unused-vars': OFF,
    '@typescript-eslint/no-unused-vars': [ERROR],

    // TODO (TOR) Ignorert inntil videre grunnet kost/nytte
    'react/no-unstable-nested-components': OFF,
    'prefer-regex-literals': OFF,
    'react/no-unused-prop-types': OFF,
    'max-classes-per-file': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    'jsx-a11y/control-has-associated-label': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/destructuring-assignment': OFF,
    '@typescript-eslint/no-empty-function': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/ban-ts-comment': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    'class-methods-use-this': OFF,

    // TODO Desse kan vel fjernast?
    '@typescript-eslint/indent': OFF,
    '@typescript-eslint/explicit-member-accessibility': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/ban-ts-ignore': OFF,
    '@typescript-eslint/camelcase': OFF,
  },
  overrides: [
    {
      files: ['*.spec.jsx', '*.spec.tsx', '*.spec.ts'],
      rules: {
        'no-unused-expressions': OFF,
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': OFF,
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.jsx'],
      rules: { 'no-undef': OFF },
    },
  ],
};
module.exports = config;
