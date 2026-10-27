import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // HTML entry points
    'index.html',
    'ung.html',
  ],
  ignore: ['.yarn/**', 'server/**'],
  workspaces: {
    '.': {
      entry: [
        'packages/sak-app/src/index.ts',
        'ung.vite.config.js',
        'aktivitetspenger.vite.config.js',
        'v2css.vite.config.ts',
      ],
    },
    'packages/ung/sak-app': {
      entry: ['bootstrapUng.tsx'],
    },
  },
};

export default config;
