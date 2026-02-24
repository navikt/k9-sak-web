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

function makeOptions(api: ProxyApi): ProxyOptions {
  return {
    // Venter 60 sekunder på svar fra backend før timeout.
    // Default i express-http-proxy er ingen timeout.
    timeout: 60_000,
    // Øker body size limit fra default 1mb for å takle enkelte dokument queries.
    limit: '20mb',

    proxyReqOptDecorator: async (options /*, req */) => {
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

    userResDecorator: (_proxyRes, _proxyResData, userReq, userRes) => {
      // On 401: inject Location header so the frontend knows where to redirect for login.
      if (userRes.statusCode === 401) {
        userRes.setHeader('Location', `${config.loginPath}?original=${userReq.originalUrl}`);
      }
      return _proxyResData;
    },

    proxyErrorHandler: (err: NodeJS.ErrnoException, res: Response, next: (err?: unknown) => void): void => {
      log.error('proxy request returned error', { code: err.code, message: err.message });
      const statusMap: Record<string, number> = { ENOTFOUND: 502, ECONNREFUSED: 502, ECONNRESET: 502, ETIMEDOUT: 504 };
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
    app.use(api.path + '/{*path}', proxy(api.url, makeOptions(api)));
    log.info('proxy setup', { fromPath: `${api.path}/*`, toPath: api.url });
  }
}
