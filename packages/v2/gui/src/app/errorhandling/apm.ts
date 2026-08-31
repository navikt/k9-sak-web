import { init, type InitOptions } from '@nais/apm';

const randomErrorId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// Feil-id-ar som har blitt rapportert til apm sidan sist reload, slik at gui kan inkludere dei i utkopiert
// feilinformasjon og vi kan slå dei opp igjen i Grafana.
export const apmReportedErrorIdList: string[] = [];

// Legg til errorId på alle exception type innslag, og lagre disse i apmErrorReportedErrorIdList.
const beforeSend: NonNullable<InitOptions['beforeSend']> = item => {
  if (item.type === 'exception') {
    const payload = item.payload as { context?: Record<string, string> };
    const errorId = randomErrorId();
    payload.context = { ...payload.context, errorId };
    apmReportedErrorIdList.push(errorId);
    if (apmReportedErrorIdList.length > 50) {
      apmReportedErrorIdList.shift(); // Veldig usansynleg, men unngå for stor array
    }
  }
  return item;
};

/** Nais app namn for frontend appane våre */
export type ApmApp = 'k9-sak-web' | 'ung-sak-web';

interface InitApmOptions {
  app: ApmApp;
}

/**
 * Bruk denne funksjon istadenfor init funksjon frå @nais/apm direkte, for å få errorId med på exceptions.
 */
export function initApm({ app }: InitApmOptions) {
  const namespace = 'k9saksbehandling';
  init({
    namespace,
    app,
    tracing: true,
    devConsoleEcho: false,
    beforeSend,
  });
}
