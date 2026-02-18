import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import config from './config.js';
import log from './log.js';
import setupProxy from './reverse-proxy.js';

const app = express();

// --- Security headers ---
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'font-src': ["'self'", 'https://cdn.nav.no', 'data:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'connect-src': ["'self'", 'https://sentry.gc.nav.no'],
      },
    },
    hsts: { maxAge: 31_536_000 },
    referrerPolicy: { policy: 'origin' },
  }),
);

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.set('trust proxy', 1);

// --- Health checks ---
app.get('/isAlive', (_req, res) => res.send('Application:UP'));
app.get('/isReady', (_req, res) => res.send('Application:READY'));

// --- Reverse proxies to backend services ---
setupProxy(app, config.proxyApis);

// --- Static files (SPA) ---
app.use(
  config.basePath,
  express.static(config.staticDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

// SPA fallback — any non-API, non-static request serves index.html
app.get('*', (_req, res) => {
  res.sendFile('index.html', { root: config.staticDir });
});

// --- Start ---
app.listen(config.port, () => log.info(`Listening on port ${config.port}`));
