import { getJestConfig } from '@storybook/test-runner';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

// @swc/jest auto-detects Node 22 → "es2023", but @swc/core 1.7.24 only supports up to es2022.
// Override with explicit target to prevent the "Unknown ES version: es2023" error in CI.
const swcJestPath = require.resolve('@swc/jest');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...testRunnerConfig,
  transform: {
    ...testRunnerConfig.transform,
    '^.+\\.[jt]sx?$': [
      swcJestPath,
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
        },
      },
    ],
  },
};
