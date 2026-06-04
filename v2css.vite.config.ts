import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';

export default defineConfig({
  plugins: [
    patchCssModules({
      generateSourceTypes: true,
      declarationMap: true,
    }),
  ],
});
