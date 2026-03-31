import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // HTML entry points
    'index.html',
    'ung.html',
  ],
  ignore: ['packages/assets/styles/dayPicker.css', '.yarn/**', 'server/**'],
  workspaces: {
    '.': {
      entry: ['packages/sak-app/src/index.ts', 'ung.vite.config.js', 'aktivitetspenger.vite.config.js'],
    },
    'packages/ung/sak-app': {
      entry: ['bootstrapUng.tsx'],
    },
  },
};

export default config;
