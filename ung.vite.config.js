import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'path';
import { loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';
import { createMockResponder, staticJsonResponse } from "./_mocks/createMockResponder.js";
import { featureTogglesFactory } from "./_mocks/featureToggles.js";
import {createHtmlPlugin} from "vite-plugin-html";

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
        '/ung/sak': {
          target: process.env.APP_URL_UNG_SAK || 'http://localhost:8085',
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
        '/k9/oppdrag': createProxy(process.env.APP_URL_K9OPPDRAG || 'http://localhost:8070'),
        '/k9/klage': createProxy(process.env.APP_URL_KLAGE || 'http://localhost:8701'),
        '/k9/tilbake': createProxy(process.env.APP_URL_K9TILBAKE || 'http://localhost:8030'),
        'k9/endringslogg': createProxy(
          process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.intern.dev.nav.no',
          {
            '^/k9/endringslogg': '',
          },
        ),
        '/k9/feature-toggle/toggles.json': createMockResponder('http://localhost:8080', staticJsonResponse(featureTogglesFactory())),
        '/ung/feature-toggle/toggles.json': createMockResponder('http://localhost:8085', staticJsonResponse(featureTogglesFactory())),
      },
    },
    base: '/k9/web',
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
          const buildDir = path.join(__dirname, "dist/k9/web")
          const oldPath = path.join(buildDir, "ung.html")
          const newPath = path.join(buildDir, "index.html")
          await fs.rename(oldPath, newPath)
        }
}
    ],
    build: {
      // Relative to the root
      outDir: './dist/k9/web',
      sourcemap: true,
      rollupOptions: {
        input: './ung.html',
        external: [
          "mockServiceWorker.js"
        ],
      },
    },
  });
};
