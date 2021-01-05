module.exports = {
  projects: [
    {
      displayName: 'test',
      cacheDirectory: '<rootDir>/jest_cache/',
      coverageDirectory: '<rootDir>/coverage/',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'less', 'css'],
      moduleNameMapper: {
        '\\.(svg)$': '<rootDir>/_mocks/fileMock.js',
        '\\.(less|css)$': 'identity-obj-proxy',
      },
      roots: ['<rootDir>/packages/'],
      setupFiles: ['<rootDir>/setup/setup.js'],
      setupFilesAfterEnv: ['<rootDir>/packages/utils-test/src/setup-test-env.ts'],
      testMatch: ['**/?(*.)+(spec).+(js|jsx|ts|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest',
        '^.+.(css|less)$': 'jest-transform-stub',
      },
      transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*nav.*).*$'],
    },
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: ['**/?(*.)+(spec).+(js|jsx|ts|tsx)'],
    },
  ],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
};
