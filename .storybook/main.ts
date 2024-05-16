import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/**/stories/**/*.stories.@(j|t)s?(x)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
    '@storybook/addon-controls',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        csfPluginOptions: null,
      },
    },
    '@storybook/addon-controls',
  ],
  staticDirs: ['../public'],

  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
