import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [
      react({
        include: [/\.jsx$/, /\.tsx?$/],
      }),
      svgr(),
    ],

    test: {
      deps: { interopDefault: true },
      environment: 'happy-dom',
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      globals: true,
      setupFiles: ['./packages/utils-test/src/setup-test-env.ts', './packages/utils-test/src/setup-test-env-hooks.ts'],
      watch: false,
      testTimeout: 15000,
      onConsoleLog(log) {
        return !log.includes(
          'Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools',
        );
      },
    },
  });
};
