import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(j|t)s?(x)'],

  addons: [
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        configureJSX: true,
      },
    },
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  staticDirs: ['../public'],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
