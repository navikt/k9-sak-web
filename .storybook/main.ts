import type { StorybookConfig } from '@storybook/react-vite';

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
  ],
  staticDirs: [
    {
      from: '../public',
      to: '/public',
    },
  ],

  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
