export const AINNTEKT_URL = 'https://arbeid-og-inntekt.nais.adeo.no';

const devHosts = ['k9.intern.dev.nav.no', 'ung.intern.dev.nav.no', 'aktivitetspenger.intern.dev.nav.no'] as const;
const prodHosts = ['k9.intern.nav.no', 'ung.intern.nav.no', 'aktivitetspenger.intern.nav.no'] as const;
const localHosts = ['localhost', '127.0.0.1', '[::1]', '::1'];

type Hosts = (typeof devHosts)[number] | (typeof prodHosts)[number];

const isKnownHost = <T extends string>(liste: readonly T[], verdi: string): verdi is T =>
  liste.some(element => element === verdi);

const LOS_DEV_URL = 'https://k9-los-web.intern.dev.nav.no';
const LOS_PROD_URL = 'https://k9-los-web.intern.nav.no';

// Record krever at alle kjente hosts har en LOS-url, så nye hosts må legges til her
const losUrlForHost: Record<Hosts, string> = {
  'k9.intern.dev.nav.no': LOS_DEV_URL,
  'ung.intern.dev.nav.no': LOS_DEV_URL,
  'aktivitetspenger.intern.dev.nav.no': `${LOS_DEV_URL}/akt`,
  'k9.intern.nav.no': LOS_PROD_URL,
  'ung.intern.nav.no': LOS_PROD_URL,
  'aktivitetspenger.intern.nav.no': `${LOS_PROD_URL}/akt`,
};

export const getPathToK9Los = (): string | null => {
  const { host } = window.location;
  if (isKnownHost(devHosts, host) || isKnownHost(prodHosts, host)) {
    return losUrlForHost[host];
  }
  return null;
};

export const getGosysUrl = (): string => {
  const { host } = window.location;
  const devUrl = 'https://gosys-q2.dev.intern.nav.no/gosys/oppgavebehandling/oppgaver/mine';
  const prodUrl = 'https://gosys.intern.nav.no/gosys/oppgavebehandling/oppgaver/mine';
  if (isKnownHost(devHosts, host)) {
    return devUrl;
  }
  if (isKnownHost(prodHosts, host)) {
    return prodUrl;
  }
  return prodUrl;
};

export const goToLos = () => {
  const path = getPathToK9Los();
  if (path) {
    window.location.assign(path);
  } else if (isDev()) {
    // I Q1 og prod havner man i LOS. Ved lokal utvikling må vi refreshe vindu for å få riktig vising,
    // da enkelte skjermbilder ikke er lagt opp til å håndtere visning dersom man blir værende.
    window.location.reload();
  }
};

export const getBackendUrl = () => (window.location.pathname.includes('/ung/web') ? 'ung' : 'k9');

export const goToSearch = () => {
  window.location.assign(`/${getBackendUrl()}/web`);
};

// Vi reknar det som dev når appen køyrer via vite dev server, eller når den er lasta frå localhost
// (t.d. ferdigbygd frontend i lokal verdikjede).
export const isDev = (): boolean => import.meta.env.DEV || localHosts.includes(window.location.hostname.toLowerCase());

export const isQ = (): boolean => window.location.hostname.toLowerCase().endsWith('.intern.dev.nav.no');

export const isProd = () => {
  const { host } = window.location;
  return host === 'k9.intern.nav.no' || host === 'ung.intern.nav.no';
};

export const getPathToAinntekt = (pathname: string) => {
  const fagsakFraUrl = pathname.split('/fagsak/')[1]?.split('/')[0];
  const isFagsakFraUrlValid = fagsakFraUrl?.match(/^[a-zA-Z0-9]{1,19}$/);
  const ainntektPath = `/${getBackendUrl()}/sak/api/register/redirect-to/a-inntekt`;
  if (!isFagsakFraUrlValid) {
    return AINNTEKT_URL;
  }
  return `${ainntektPath}?saksnummer=${fagsakFraUrl}`;
};
