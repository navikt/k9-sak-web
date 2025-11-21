import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(j|t)s?(x)'],

  addons: [{
    name: getAbsolutePath("@storybook/addon-docs"),
    options: {
      configureJSX: true,
      csfPluginOptions: null,
    },
  }, getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-vitest")],

  staticDirs: ['../public'],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
