import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';
import { createMockResponder, staticJsonResponse } from "./_mocks/createMockResponder.js";
import { featureTogglesFactory } from "./_mocks/featureToggles.js";

const createProxy = (target, pathRewrite) => ({
  target,
  changeOrigin: !!target,
  secure: false,
  ws: false,
  rewrite: p =>
    pathRewrite ? p.replace(new RegExp(Object.keys(pathRewrite)[0]), pathRewrite[Object.keys(pathRewrite)[0]]) : p,
  configure: proxy => {
    proxy.on('proxyRes', (proxyRes, req, res) => {
      if (proxyRes.statusCode === 401) {
        // eslint-disable-next-line no-param-reassign
        proxyRes.headers.location = `/k9/sak/resource/login?original=${req.originalUrl}`;
      }
    });
  },
});

function excludeMsw() {
  return {
    name: "exclude-msw",
    resolveId(source) {
      return source === "virtual-module" ? source : null;
    },
    renderStart(outputOptions, _inputOptions) {
      const outDir = outputOptions.dir;
      if (!outDir.includes('storybook')) {
        const msWorker = path.resolve(outDir, "mockServiceWorker.js");
        fs.rm(msWorker, () => console.log(`Deleted ${msWorker}`));
      }
    },
  };
}

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/envDir`) };
  return defineConfig({
    server: {
      port: 9000,
      proxy: {
        '/k9/formidling/dokumentdata': createProxy(process.env.APP_URL_K9FORMIDLING_DD || 'http://localhost:8294'),
        '/k9/formidling': createProxy(process.env.APP_URL_K9FORMIDLING || 'http://localhost:8290'),
        '/k9/sak': {
          target: process.env.APP_URL_SAK || 'http://localhost:8080',
          changeOrigin: !!process.env.APP_URL_SAK,
          ws: false,
          secure: false,
          configure: proxy => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.APP_URL_SAK)) {
                // eslint-disable-next-line no-param-reassign, prefer-destructuring
                proxyRes.headers.location = proxyRes.headers.location.split(process.env.APP_URL_SAK)[1];
              }
              if (proxyRes.statusCode === 401) {
                // eslint-disable-next-line no-param-reassign
                proxyRes.headers.location = '/k9/sak/resource/login';
              }
            });
          },
        },
        '/k9/oppdrag': createProxy(process.env.APP_URL_K9OPPDRAG || 'http://localhost:8070'),
        '/k9/klage': createProxy(process.env.APP_URL_KLAGE || 'http://localhost:8701'),
        '/k9/tilbake': createProxy(process.env.APP_URL_K9TILBAKE || 'http://localhost:8030'),
        'k9/diagnosekoder/': createProxy(process.env.APP_URL_DIAGNOSEKODER || 'http://localhost:8300', {
          '^/k9/diagnosekoder/': '/diagnosekoder',
        }),
        'k9/endringslogg': createProxy(
          process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.intern.dev.nav.no',
          {
            '^/k9/endringslogg': '',
          },
        ),
        '/k9/feature-toggle/toggles.json': createMockResponder('http://localhost:8080', staticJsonResponse(featureTogglesFactory())),
      },
    },
    base: '/k9/web',
    publicDir: './public',
    plugins: [
      react({
        include: [/\.jsx$/, /\.tsx?$/],

      }),
      svgr(),
      excludeMsw()
    ],
    build: {
      // Relative to the root
      outDir: './dist/k9/web',
      sourcemap: true,
      rollupOptions: {
        external: [
          "mockServiceWorker.js"
        ],
      },
    },
    test: {
      deps: {
        inline: ['@navikt/k9-sak-typescript-client'], // Without this, tests using k9-sak-typescript-client through backend project failed.
        interopDefault: true
      },
      environment: 'jsdom',
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      globals: true,
      setupFiles: ['./vitest-setup.ts', './packages/utils-test/src/setup-test-env-hooks.ts'],
      watch: false,
      testTimeout: 15000,
      onConsoleLog(log) {
        // if (log.includes('Warning: ReactDOM.render is no longer supported in React 18.')) return false
        return !log.includes(
          'Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools',
        );
      },
    }
  });
};
