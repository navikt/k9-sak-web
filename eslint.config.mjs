// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

// @ts-check

import eslint from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import configPrettier from 'eslint-config-prettier';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginVitest from 'eslint-plugin-vitest';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Viss vi ønsker eslint-plugin-jest-dom  aktivert: import pluginJestDom from 'eslint-plugin-jest-dom';
// ^- Rapporterer ein del feil, så virker ikkje å ha vore aktivert før.

const OFF = 0;
const ERROR = 2;

const config = tseslint.config(
  {
    ignores: ['server/**'],
  },
  ...pluginQuery.configs['flat/recommended'],
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  configPrettier,
  pluginReact.configs.flat['jsx-runtime'],
  pluginJsxA11y.flatConfigs.recommended,
  pluginVitest.configs.recommended,
  storybook.configs['flat/recommended'],
  // Viss vi ønsker jest-dom plugin aktivert: pluginJestDom.configs["flat/recommended"],
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: { project: './tsconfig.json' },
    },
    linterOptions: {
      // Vurder å enable denne seinare
      reportUnusedDisableDirectives: false,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': OFF,
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'React', // TODO Fjern denne og samtidig alle ubrukte React imports. Unødvendig etter overgang til react-jsx i tsconfig
        },
      ],
      'jsx-a11y/no-autofocus': OFF, // Skrudd av ved migrering til jsx-a11y recommended config. Vurder å fikse seinare.
      'jsx-a11y/anchor-is-valid': OFF,
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Block importing test files into production logic
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/*.spec',
                '**/*.spec.ts',
                '**/*.spec.js',
                '**/*.spec.tsx',
                '**/*.spec.jsx',
                '**/*.test',
                '**/*.test.ts',
                '**/*.test.js',
                '**/*.test.tsx',
                '**/*.test.jsx',
              ],
              message: 'Do not import test files into production code. Test code should remain isolated.',
            },
          ],
        },
      ],
    },
  },
  {
    // Fiks: Finn eller opprett en re-eksport i /v2/backend under de eksisterende mappene (k9sak, k9klage, k9tilbake, ungsak, ungtilbake, combined).
    // Eksporter både type og value (const) dersom det finnes en verdi
    // Se f.eks v2/backend/src/k9sak/kodeverk/behandling/BehandlingStatus.ts for mønster på re-eksport av typar.
    // Se f.eks v2/backend/src/k9sak/tjenester/ for mønster på re-eksport av SDK-funksjoner.
    // For typer brukt på tvers av backends, bruk combined/-mappa.
    // Etter at re-eksport er opprettet, oppdater importstiene i filene som bruker de genererte importene.
    ignores: ['packages/v2/backend/**'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['@k9-sak-web/backend/*/generated/*'],
              message:
                'Ikke importer direkte fra generert typescript. Re-eksporter heller fra /v2/backend. Dette er fordi navnene på eksportene i de genererte filene kan endre seg, og det er derfor bedre å ha en stabil eksport fra /v2/backend.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.stories.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx', '**/test-helpers/**'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      // Allow tests and stories to import other test files/helpers
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-var-requires': OFF,
      '@typescript-eslint/no-require-imports': OFF,
    },
    languageOptions: {
      globals: {
        require: true,
        module: true,
      },
    },
  },
  {
    files: ['packages/v2/**.*.ts', 'packages/v2/**.*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': ERROR,
    },
  },
  {
    files: ['**/KroniskSykObjektTilMikrofrontend.ts'],
    rules: {
      'no-constant-binary-expression': OFF, // TODO Fiks denne, sannsynlegvis bug
    },
  },
  {
    // så ikke typescript klager på denne fila
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
);

export default config;
