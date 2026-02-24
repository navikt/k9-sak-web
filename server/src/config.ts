export interface ProxyApi {
  path: string;
  url: string;
  stripPrefix?: boolean;
  /** OBO scope — populate when token exchange is enabled. */
  scopes?: string;
}

const APP_VARIANTS = {
  K9: 'k9',
  UNG: 'ung',
} as const;

function env(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (fallback !== undefined) return fallback;
  console.error(`Missing required environment variable: ${name}`);
  process.exit(1);
}

// APP_VARIANT is set via Dockerfile ARG (k9 or ung).
const appVariant = env('APP_VARIANT');
const erEntenK9EllerUng = appVariant === APP_VARIANTS.K9 || appVariant === APP_VARIANTS.UNG;

if (!erEntenK9EllerUng) {
  console.error(`APP_VARIANT: ${appVariant}. Kan kun være '${APP_VARIANTS.K9}' eller '${APP_VARIANTS.UNG}'.`);
  process.exit(1);
}

// Proxy backend entries. Order matters — more specific paths first.
// Add `scopes` per entry when OBO token exchange is needed.
// Login path used for Location header on intercepted 401 responses (matches nginx error_page 401 behaviour).
const loginPath = appVariant === APP_VARIANTS.UNG ? '/ung/sak/resource/login' : '/k9/sak/resource/login';

const proxyApis: ProxyApi[] =
  appVariant === APP_VARIANTS.UNG
    ? [
        { path: '/ung/sak', url: env('APP_URL') },
        { path: '/ung/tilbake', url: env('APP_URL_UNG_TILBAKE') },
      ]
    : [
        { path: '/k9/formidling/dokumentdata', url: env('APP_URL_K9FORMIDLING_DD') },
        { path: '/k9/formidling', url: env('APP_URL_K9FORMIDLING') },
        { path: '/k9/sak', url: env('APP_URL') },
        { path: '/k9/oppdrag', url: env('APP_URL_K9OPPDRAG') },
        { path: '/k9/klage', url: env('APP_URL_KLAGE') },
        { path: '/k9/tilbake', url: env('APP_URL_K9TILBAKE') },
        { path: '/k9/fordel', url: env('APP_URL_K9FORDEL') },
        { path: '/k9/endringslogg', url: env('ENDRINGSLOGG_URL'), stripPrefix: true },
      ];

export default {
  appVariant,
  loginPath,
  port: Number(env('PORT', '9000')),
  staticDir: `./dist/${appVariant}/web`,
  basePath: `/${appVariant}/web`,
  proxyApis: proxyApis.filter(e => e.url.length > 0),
};
