import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['package.json', 'packages/**/package.json'],
  // Ignorer interne workspace-imports som Knip ikke klarer å resolve
  // pga TypeScript path mapping kombinert med .js extensions
  ignoreDependencies: [
    // Alle @k9-sak-web/* og @fpsak-frontend/* er interne workspace packages
    /^@k9-sak-web\//,
    /^@fpsak-frontend\//,
  ],
};

export default config;
