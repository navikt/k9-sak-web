import type { Express, Request, Response } from 'express';
import proxy, { type ProxyOptions } from 'express-http-proxy';
import type { ProxyApi } from './config.js';
import config from './config.js';
import log from './log.js';

// ── Token exchange hook ──
// Currently a passthrough. To add OBO token exchange later:
//   1. yarn add @navikt/oasis  (in server/)
//   2. Implement this function using the api.scopes field
//   3. Uncomment the call in proxyReqOptDecorator below
//
// import { requestOboToken, validateToken } from '@navikt/oasis';
// async function exchangeToken(req: Request, api: ProxyApi): Promise<string | null> {
//   const token = req.headers.authorization?.replace('Bearer ', '');
//   if (!token) return null;
//   const validation = await validateToken(token);
//   if (!validation.ok) return null;
//   const obo = await requestOboToken(token, api.scopes!);
//   return obo.ok ? obo.token : null;
// }

// ── Intercepted error responses (replicates nginx proxy_intercept_errors + error_page) ──
// nginx replaced the entire upstream error response (including headers) with a clean JSON body.
// We do the same to avoid leaking upstream headers (Set-Cookie, WWW-Authenticate, etc.).
const interceptedErrors: Record<number, { type: string; feilmelding: string }> = {
  401: { type: 'MANGLER_TILGANG_FEIL', feilmelding: 'Bruker ikke innlogget' },
  403: { type: 'MANGLER_TILGANG_FEIL', feilmelding: 'Innlogget bruker har ikke tilgang til ressursen' },
  404: { type: 'IKKE_FUNNET_FEIL', feilmelding: 'Kunne ikke finne ressursen, beklager.' },
  504: { type: 'GENERELL_FEIL', feilmelding: 'Timet ut' },
};

function makeOptions(api: ProxyApi): ProxyOptions {
  return {
    timeout: 40_000,

    proxyReqOptDecorator: async (options, req) => {
      // When OBO token exchange is enabled, uncomment the following
      // and remove cookie forwarding:
      // const oboToken = await exchangeToken(req, api);
      // if (oboToken) options.headers!.Authorization = `Bearer ${oboToken}`;
      // delete (options.headers as Record<string, unknown>).cookie;
      return options;
    },

    proxyReqPathResolver: (req: Request): string => {
      const { pathname, search } = new URL(req.originalUrl, 'http://localhost');
      const resolved = api.stripPrefix ? pathname.replace(api.path, '') || '/' : pathname;
      return resolved + (search ?? '');
    },

    // Replicate nginx proxy_intercept_errors: replace the entire response on error status codes.
    userResDecorator: (_proxyRes, _proxyResData, userReq, userRes) => {
      const intercepted = interceptedErrors[userRes.statusCode];
      if (!intercepted) {
        return _proxyResData; // Non-error: pass through unchanged.
      }
      const body = JSON.stringify(intercepted);

      // Strip all upstream headers and set only what nginx would.
      const existingHeaders = userRes.getHeaderNames();
      for (const h of existingHeaders) {
        userRes.removeHeader(h);
      }
      userRes.setHeader('Content-Type', 'application/json');
      userRes.setHeader('Content-Length', Buffer.byteLength(body));

      // On 401: add Location header with login path + ?original= (same as nginx @401_json).
      if (userRes.statusCode === 401) {
        userRes.setHeader('Location', `${config.loginPath}?original=${userReq.originalUrl}`);
      }

      return Buffer.from(body);
    },

    proxyErrorHandler: (
      err: NodeJS.ErrnoException,
      res: Response,
      next: (err?: unknown) => void,
    ): void => {
      log.error(`Proxy error: ${err.code} ${err.message}`);
      const statusMap: Record<string, number> = { ENOTFOUND: 404, ECONNRESET: 504, ECONNREFUSED: 502 };
      const status = err.code ? statusMap[err.code] : undefined;
      if (status) {
        res.status(status).send();
      } else {
        next(err);
      }
    },
  };
}

export default function setupProxy(app: Express, apis: ProxyApi[]): void {
  for (const api of apis) {
    app.use(`${api.path}/*`, proxy(api.url, makeOptions(api)));
    log.info(`Proxy: ${api.path}/* -> ${api.url}`);
  }
}
