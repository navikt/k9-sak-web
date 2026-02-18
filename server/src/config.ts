export interface ProxyApi {
  path: string;
  url: string;
  stripPrefix?: boolean;
  /** Login URL to return in Location header on 401 responses. */
  loginPath?: string;
  /** OBO scope — populate when token exchange is enabled. */
  scopes?: string;
}

function env(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (fallback !== undefined) return fallback;
  console.error(`Missing required environment variable: ${name}`);
  process.exit(1);
}

// APP_VARIANT is set via Dockerfile ARG (k9 or ung).
const appVariant = env('APP_VARIANT', 'k9');

// Proxy backend entries. Order matters — more specific paths first.
// Add `scopes` per entry when OBO token exchange is needed.
const proxyApis: (Omit<ProxyApi, 'url'> & { url: string | undefined })[] =
  appVariant === 'ung'
    ? [
        { path: '/ung/sak', url: env('APP_URL'), loginPath: '/ung/sak/resource/login' },
        { path: '/ung/tilbake', url: process.env.APP_URL_UNG_TILBAKE },
      ]
    : [
        { path: '/k9/formidling/dokumentdata', url: process.env.APP_URL_K9FORMIDLING_DD },
        { path: '/k9/formidling', url: process.env.APP_URL_K9FORMIDLING },
        { path: '/k9/sak', url: env('APP_URL'), loginPath: '/k9/sak/resource/login' },
        { path: '/k9/oppdrag', url: process.env.APP_URL_K9OPPDRAG },
        { path: '/k9/klage', url: process.env.APP_URL_KLAGE },
        { path: '/k9/tilbake', url: process.env.APP_URL_K9TILBAKE },
        { path: '/k9/fordel', url: process.env.APP_URL_K9FORDEL },
        { path: '/k9/endringslogg', url: process.env.ENDRINGSLOGG_URL, stripPrefix: true },
      ];

export default {
  appVariant,
  port: Number(env('PORT', '9000')),
  staticDir: `./dist/${appVariant}/web`,
  basePath: `/${appVariant}/web`,
  proxyApis: proxyApis.filter((e): e is ProxyApi => Boolean(e.url)),
};
