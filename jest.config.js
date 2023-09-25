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
        uuid: require.resolve('uuid'),
      },
      roots: ['<rootDir>/packages/'],
      setupFiles: ['<rootDir>/setup/setup.js'],
      setupFilesAfterEnv: [
        '@testing-library/jest-dom/extend-expect',
        '<rootDir>/packages/utils-test/src/setup-test-env.ts',
        '<rootDir>/packages/utils-test/src/setup-test-env-hooks.ts',
      ],
      testEnvironment: 'jsdom',
      testMatch: ['**/?(*.)+(spec).+(jsx|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest',
        '^.+.(css|less)$': 'jest-transform-stub',
      },
      transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*nav.*).*$'],
    },
  ],
};
