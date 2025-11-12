// @ts-nocheck
import { defineConfig } from 'vitest/config';

const isCI = process.env.CI === 'true';

export default defineConfig({
  test: {
    // Ren logikk: kjør i node for lav overhead
    environment: 'node',
    include: [
      'packages/**/*.spec.ts',
      'packages/**/*.test.ts',
    ],
    // Ekskluder alle DOM / React relaterte filer
    exclude: [
      'packages/**/*.spec.dom.ts',
      'packages/**/*.test.dom.ts',
      'packages/**/*.spec.dom.tsx',
      'packages/**/*.test.dom.tsx',
      'packages/**/*.spec.tsx',
      'packages/**/*.test.tsx',
    ],
    server: {
      deps: {
        inline: [
          '@navikt/k9-sak-typescript-client',
          '@navikt/ung-sak-typescript-client',
          '@navikt/k9-klage-typescript-client',
          '@navikt/k9-tilbake-typescript-client',
          '@navikt/ung-tilbake-typescript-client',
        ],
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    globals: true,
    setupFiles: [
      './vitest-setup.ts',
      './packages/utils-test/src/setup-test-env-hooks.ts',
    ],
    watch: false,
    testTimeout: 15000,
    ...(isCI ? { pool: 'threads' } : {}),
    reporters: isCI ? ['default', 'json'] : ['default'],
    onConsoleLog(log) {
      return !log.includes(
        'Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools',
      );
    },
  },
});
