import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, ProxyOptions } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgr from 'vite-plugin-svgr';


type RewritePath = `^/k9/${string}`

interface PathRewriteDefinition {
  [path: RewritePath]: string;
}


// Convert your Webpack proxy to Vite's style
const createProxy = (target: string, pathRewrite?: PathRewriteDefinition): string | ProxyOptions => ({
  target,
  changeOrigin: !!target,
  secure: false,
  ws: false,
  rewrite: p =>
    pathRewrite ? p.replace(new RegExp(Object.keys(pathRewrite)[0]), pathRewrite[Object.keys(pathRewrite)[0]]) : p,
  configure: proxy => {
    proxy.on('proxyRes', (proxyRes, req, res) => {
      if (proxyRes.statusCode === 401) {
        // @ts-ignore TODO Remove this
        throw new Error(`TODO check if we can use req.url here, or if originalUrl exists. req.url: ${req.url}, req.originalUrl: ${req.originalUrl}`)
        // eslint-disable-next-line no-param-reassign
        proxyRes.headers.location = `/k9/sak/resource/login?original=${req.url}`;
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
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

        '/k9/microfrontend/omsorgsdager': createProxy(
          process.env.OMSORGSDAGER_FRONTEND_URL || 'http://localhost:8088',
          {
            '^/k9/microfrontend/omsorgsdager': '',
          },
        ),
        '/k9/microfrontend/medisinsk-vilkar': createProxy(
          process.env.MEDISINSK_VILKAR_FRONTEND_URL || 'http://localhost:8081',
          {
            '^/k9/microfrontend/medisinsk-vilkar': '',
          },
        ),
        '/k9/microfrontend/omsorgen-for': createProxy(
          process.env.OMSORGEN_FOR_FRONTEND_URL || 'http://localhost:8282',
          {
            '^/k9/microfrontend/omsorgen-for': '',
          },
        ),
        '/k9/microfrontend/psb-om-barnet': createProxy(
          process.env.PSB_OM_BARNET_FRONTEND_URL || 'http://localhost:8585',
          {
            '^/k9/microfrontend/psb-om-barnet': '',
          },
        ),
        '/k9/microfrontend/psb-etablert-tilsyn': createProxy(
          process.env.PSB_ETABLERT_TILSYN_FRONTEND_URL || 'http://localhost:8484',
          {
            '^/k9/microfrontend/psb-etablert-tilsyn': '',
          },
        ),
        '/k9/microfrontend/psb-uttak': createProxy(process.env.PSB_UTTAK_FRONTEND_URL || 'http://localhost:8181', {
          '^/k9/microfrontend/psb-uttak': '',
        }),
        '/k9/microfrontend/psb-inntektsmelding': createProxy(
          process.env.PSB_INNTEKTSMELDING_FRONTEND_URL || 'http://localhost:8383',
          {
            '^/k9/microfrontend/psb-inntektsmelding': '',
          },
        ),
        '/k9/endringslogg': createProxy(
          process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.intern.dev.nav.no',
          {
            '^/k9/endringslogg': '',
          },
        ),
      },
    },
    base: '/k9/web/',
    publicDir: './public',
    plugins: [
      react({
        include: [/\.jsx$/, /\.tsx?$/],
      }),
      svgr(),
      // viteStaticCopy({
      //   targets: [
      //     {
      //       src: path.resolve(__dirname, './public/sprak/nb_NO.json'),
      //       dest: 'sprak/nb_NO.json',
      //       overwrite: true,
      //       transform: {
      //         transformer: content => content,
      //         cache: {
      //           keys: {
      //             key: '[contenthash]',
      //           },
      //         },
      //       },
      //     },
      //   ],
      // }),
      viteMockServe({
        mockPath: '_mocks',
      }),
    ],
    build: {
      // Relative to the root
      outDir: './dist/k9/web',
    },
  };
});
