import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(j|t)s?(x)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-mcp',
  ],
  staticDirs: ['../public'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
