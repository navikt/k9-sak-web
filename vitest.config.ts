import { defineConfig, mergeConfig } from "vitest/config";
import viteConfigDefiner from "./vite.config";

import "vitest-axe/extend-expect";

export default defineConfig((params) => {
  return mergeConfig(viteConfigDefiner(params), defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }))
})
