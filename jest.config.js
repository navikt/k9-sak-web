const path = require('path');

module.exports = {
  projects: [
    {
      displayName: 'test',
      cacheDirectory: '../../jest_cache/',
      coverageDirectory: '../coverage/',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'less', 'css'],
      moduleNameMapper: {
        '\\.(svg)$': '<rootDir>/_mocks/fileMock.js',
        '\\.(less|css)$': 'identity-obj-proxy',
        '^uuid': require.resolve('uuid'),
      },
      roots: ['../'],
      setupFiles: ['../../setup/setup.js'],
      setupFilesAfterEnv: [
        '../utils-test/src/setup-test-env.ts',
        '../utils-test/src/setup-test-env-hooks.ts',
      ],
      testEnvironment: 'jsdom',
      testEnvironmentOptions: {
        customExportConditions: ['node'],
      },
      testMatch: ['**/?(*.)+(spec).+(js|jsx|ts|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': ['babel-jest', { configFile: path.resolve(__dirname, './babel.config.js') }],
        '^.+.(css|less)$': 'jest-transform-stub',
      },
      transformIgnorePatterns: ['...*(node_modules)(?!.*nav.*).*$'],
    },
  ],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
};
