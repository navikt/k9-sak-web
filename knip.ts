import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // HTML entry points
    'index.html',
    'ung.html',
  ],
  ignore: ['packages/assets/styles/dayPicker.css', '.yarn/**'],
  workspaces: {
    '.': {
      entry: [
        'packages/sak-app/src/index.ts',
        'ung.vite.config.js',
        'scripts/sentry-release.cjs',
        'scripts/sentry-release-ung.cjs',
      ],
    },
    'packages/ung/sak-app': {
      entry: ['bootstrapUng.tsx'],
    },
  },
};

export default config;
