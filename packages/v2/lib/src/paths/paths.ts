const { DEV: IS_DEV } = import.meta.env;
export const AINNTEKT_URL = 'https://arbeid-og-inntekt.nais.adeo.no';

export const getPathToK9Los = (): string | null => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no' || host === 'ung.intern.dev.nav.no') {
    return 'https://k9-los-web.intern.dev.nav.no';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-los-web.intern.nav.no';
  }
  return null;
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

export const isDev = () => IS_DEV;

export const getPathToAinntekt = (pathname: string) => {
  const fagsakFraUrl = pathname.split('/fagsak/')[1]?.split('/')[0];
  const isFagsakFraUrlValid = fagsakFraUrl?.match(/^[a-zA-Z0-9]{1,19}$/);
  const ainntektPath = `/${getBackendUrl()}/sak/api/register/redirect-to/a-inntekt`;
  if (!isFagsakFraUrlValid) {
    return AINNTEKT_URL;
  }
  return `${ainntektPath}?saksnummer=${fagsakFraUrl}`;
};
