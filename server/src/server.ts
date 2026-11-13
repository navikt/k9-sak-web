import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import config from './config.js';
import log from './log.js';
import setupProxy from './reverse-proxy.js';

const app = express();

const cspDirectives = {
  'default-src': ["'self'", 'https://cdn.nav.no'],
  'img-src': ["'self'", 'data:', 'https://cdn.nav.no'],
  'font-src': ["'self'", 'https://cdn.nav.no', 'data:'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.nav.no'],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.nav.no'],
  'connect-src': [
    "'self'",
    'https://reops-event-proxy.ekstern.dev.nav.no',
    'https://cdn.nav.no',
    'https://telemetry.nav.no',
    'https://telemetry.ekstern.dev.nav.no',
  ],
};

// --- Security headers ---
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: cspDirectives,
    },
    referrerPolicy: { policy: 'origin' },
    // Ikke send Cross-Origin-Opener-Policy-header (nettleserstandard = unsafe-none).
    // Login-popupen navigerer cross-origin til login.microsoftonline.com og tilbake.
    // Alle COOP-verdier utenom unsafe-none fører til browsing context group switch
    // ved retur, som permanent nullifiserer window.opener og bryter postMessage-basert
    // auth-flyt.
    crossOriginOpenerPolicy: false,
  }),
);

// Strengere script-src uten 'unsafe-inline' kjøres i Report-Only ved siden av policyen over.
// Brudd vises i nettleserkonsollen. Når den er ren i alle hovedflyter, kan 'unsafe-inline' fjernes over.
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    reportOnly: true,
    directives: { ...cspDirectives, 'script-src': ["'self'", 'https://cdn.nav.no'] },
  }),
);

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));
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
app.get('{*path}', (_req, res) => {
  res.sendFile('index.html', { root: config.staticDir });
});

// --- Start ---
const server = app.listen(config.port, () => log.info(`Listening on port ${config.port}`));

process.on('SIGTERM', () => {
  log.info('SIGTERM received.');
  setTimeout(() => {
    log.info('SIGTERM stopping server.');
    server.close(error => {
      if (error != null) {
        log.warn('SIGTERM received on non-open server.', { error });
      } else {
        log.info('SIGTERM stopped server.');
      }
      process.exit(0);
    });
  }, 2_000); // Vent 2 sekund før stopp starte, så kubernetes load balancer får tid til å rute nye requests til andre pods
});
