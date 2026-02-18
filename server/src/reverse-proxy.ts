import type { Express, Request, Response } from 'express';
import proxy, { type ProxyOptions } from 'express-http-proxy';
import type { ProxyApi } from './config.js';
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
    timeout: 40_000,

    proxyReqOptDecorator: async (options, req) => {
      // const oboToken = await exchangeToken(req, api);
      // if (oboToken) options.headers!.Authorization = `Bearer ${oboToken}`;
      delete (options.headers as Record<string, unknown>).cookie;
      return options;
    },

    proxyReqPathResolver: (req: Request): string => {
      const { pathname, search } = new URL(req.originalUrl, 'http://localhost');
      const resolved = api.stripPrefix ? pathname.replace(api.path, '') || '/' : pathname;
      return resolved + (search ?? '');
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
