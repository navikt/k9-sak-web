import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'path';
import sourcemaps from 'rollup-plugin-sourcemaps2';
import { loadEnv } from 'vite';
import { createHtmlPlugin } from "vite-plugin-html";
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
        proxyRes.headers.location = `/ung/sak/resource/login?original=${req.originalUrl}`;
      }
      // Viss respons frå proxied server inneheld location header med server adresse, fjern server addressa slik at redirect
      // går til dev server istadenfor proxied server. Dette for å unngå CORS feil når request går direkte til proxied server.
      if (proxyRes.headers.location?.startsWith(target)) {
        // eslint-disable-next-line no-param-reassign
        proxyRes.headers.location = proxyRes.headers.location.replace(target, "")
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
        fs.rm(msWorker).then(() => console.log(`Deleted ${msWorker}`));
      }
    },
  };
}

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/envDir/ung`) };
  return defineConfig({
    server: {
      port: 9005,
      proxy: {
        '/ung/sak': {
          target: process.env.APP_URL_UNG_SAK || 'http://localhost:8901',
          changeOrigin: !!process.env.APP_URL_UNG_SAK,
          ws: false,
          secure: false,
          configure: proxy => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.APP_URL_UNG_SAK)) {
                // eslint-disable-next-line no-param-reassign, prefer-destructuring
                proxyRes.headers.location = proxyRes.headers.location.split(process.env.APP_URL_UNG_SAK)[1];
              }
              if (proxyRes.statusCode === 401) {
                // eslint-disable-next-line no-param-reassign
                proxyRes.headers.location = '/ung/sak/resource/login';
              }
            });
          },
        },
        '/ung/feature-toggle/toggles.json': createMockResponder('http://localhost:8901', staticJsonResponse(featureTogglesFactory())),
      },
    },
    base: '/ung/web',
    publicDir: './public',
    plugins: [
      createHtmlPlugin({
        template: 'ung.html'
      }),
      react({
        include: [/\.jsx$/, /\.tsx?$/],

      }),
      svgr(),
      excludeMsw(),
      {
        // Endre namn på bygd entrypoint html frå ung.html til index.html
        name: "rename-html-entry",
        closeBundle: async () => {
          const buildDir = path.join(__dirname, "dist/ung/web")
          const oldPath = path.join(buildDir, "ung.html")
          const newPath = path.join(buildDir, "index.html")
          await fs.rename(oldPath, newPath)
        }
      }
    ],
    build: {
      // Relative to the root
      outDir: './dist/ung/web',
      sourcemap: true,
      rollupOptions: {
        input: './ung.html',
        external: [
          "mockServiceWorker.js"
        ],
        plugins: [sourcemaps({ exclude: /@sentry/ })],
      },
    },
  });
};
