// @ts-check

import eslint from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import configPrettier from 'eslint-config-prettier';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginVitest from 'eslint-plugin-vitest';
import globals from "globals";
import tseslint from 'typescript-eslint';

// Viss vi ønsker eslint-plugin-jest-dom  aktivert: import pluginJestDom from 'eslint-plugin-jest-dom';
// ^- Rapporterer ein del feil, så virker ikkje å ha vore aktivert før.


const OFF = 0;
const WARN = 1;
const ERROR = 2;

const config = tseslint.config(
  ...pluginQuery.configs['flat/recommended'],
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  configPrettier,
  pluginReact.configs.flat['jsx-runtime'],
  pluginJsxA11y.flatConfigs.recommended,
  pluginVitest.configs.recommended,
  // Viss vi ønsker jest-dom plugin aktivert: pluginJestDom.configs["flat/recommended"],
  {
    plugins: {
      'react-hooks': pluginReactHooks
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      // Vurder å enable denne seinare
      reportUnusedDisableDirectives: false
    },
    rules: {
      '@typescript-eslint/no-explicit-any': OFF,
      '@typescript-eslint/no-unused-vars': [
        "error",
        {
          varsIgnorePattern: "React" // TODO Fjern denne og samtidig alle ubrukte React imports. Unødvendig etter overgang til react-jsx i tsconfig
        }
      ],
      'jsx-a11y/no-autofocus': OFF, // Skrudd av ved migrering til jsx-a11y recommended config. Vurder å fikse seinare.
      'jsx-a11y/anchor-is-valid': OFF,
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ["**/*.stories.tsx"],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    }
  },
  {
    files: ["**/*.cjs"],
    rules: {
      '@typescript-eslint/no-var-requires': OFF,
      '@typescript-eslint/no-require-imports': OFF,
    },
    languageOptions: {
      globals: {
        require: true,
        module: true,
      }
    }
  },
  {
    files: ["packages/v2/**.*.ts", "packages/v2/**.*.tsx"],
    rules: {
      '@typescript-eslint/no-explicit-any': ERROR
    }
  },
  {
    files: ["**/KroniskSykObjektTilMikrofrontend.ts"],
    rules: {
      'no-constant-binary-expression': OFF // TODO Fiks denne, sannsynlegvis bug
    }
  }
)

export default config
