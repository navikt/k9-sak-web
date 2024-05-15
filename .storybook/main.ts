import type { StorybookConfig } from '@storybook/react-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(j|t)s?(x)'],
  addons: [
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        csfPluginOptions: null,
      },
    },
    '@storybook/addon-controls',
    '@storybook/addon-a11y',
  ],

  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      plugins: [
        viteStaticCopy({
          targets: [
            {
              src: 'public/mockServiceWorker.js',
              dest: '.',
            },
          ],
        }),
      ],
    });
  },
};

export default config;
