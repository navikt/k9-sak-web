import { buildPath } from '@navikt/ft-utils';

export const getPathToK9Los = (): string => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return 'https://k9-los-web.intern.dev.nav.no';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-los-web.intern.nav.no';
  }
  return '';
};

export const getPathToK9Punsj = (): string => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return 'https://k9-punsj-frontend.intern.dev.nav.no/';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-punsj-frontend.intern.nav.no/';
  }
  return '';
};

export const fagsakRoutePath = '/fagsak/:saksnummer//*';
export const fagsakPath = '/fagsak/:saksnummer/';
export const pathToFagsak = (saksnummer: string): string => buildPath(fagsakPath, { saksnummer });
