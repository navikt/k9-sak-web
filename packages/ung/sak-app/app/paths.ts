import { Location, Search } from 'history';

import { buildPath, formatQueryString, parseQueryString } from '@fpsak-frontend/utils';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_PROSESS_STEG = 'default';

type QueryParams = {
  punkt?: string;
  fakta?: string;
  stotte?: string;
  risiko?: boolean;
};

export const fagsakRoutePath = '/fagsak/:saksnummer//*';
export const behandlingerRoutePath = `behandling//*`;
export const behandlingRoutePath = `/:behandlingId/`;

export const fagsakPath = '/fagsak/:saksnummer/';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = (saksnummer: string): string => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = (saksnummer: string): string => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer: string, behandlingId: number): string =>
  buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = (): string => '/404';

const emptyQueryString = (queryString: string): boolean => queryString === '?' || !queryString;

const updateQueryParams = (queryString: string, nextParams: QueryParams): Search => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

export const getLocationWithQueryParams = (location: Location, queryParams: QueryParams): Location => ({
  ...location,
  search: updateQueryParams(location.search, queryParams),
});

export const getSupportPanelLocationCreator =
  (location: Location) =>
  (supportPanel: string): Location =>
    getLocationWithQueryParams(location, { stotte: supportPanel });
export const getProsessStegLocation =
  (location: Location) =>
  (prosessSteg: string): Location =>
    getLocationWithQueryParams(location, { punkt: prosessSteg });
export const getFaktaLocation =
  (location: Location) =>
  (fakta: string): Location =>
    getLocationWithQueryParams(location, { fakta });

// eslint-disable-next-line
export const getLocationWithDefaultProsessStegAndFakta = (location: Location): Location =>
  getLocationWithQueryParams(location, { punkt: DEFAULT_PROSESS_STEG, fakta: DEFAULT_FAKTA });

export const getPathToK9Los = (): string | null => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return 'https://k9-los-web.intern.dev.nav.no';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-los-web.intern.nav.no';
  }
  return null;
};

export const getPathToK9Punsj = (): string | null => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return 'https://k9-punsj-frontend.intern.dev.nav.no/';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-punsj-frontend.intern.nav.no/';
  }
  return null;
};

export const createLocationForSkjermlenke = (behandlingLocation: Location, skjermlenkeCode: string): Location => {
  const skjermlenke = skjermlenkeCodes[skjermlenkeCode] || { punktNavn: 'default', faktaNavn: 'default' };
  return getLocationWithQueryParams(behandlingLocation, { punkt: skjermlenke.punktNavn, fakta: skjermlenke.faktaNavn });
};

// Kan gå inn på url som ser sånn ut "http://localhost:9000/k9/web/fagsak/", men
// da vil ein automatisk redirecte til http://localhost:9000/k9/web/fagsak/behandling/*"
export const erUrlUnderBehandling = (location: Location): boolean => !location.pathname.includes('behandling/');

export const erBehandlingValgt = (location: Location): boolean =>
  location.pathname.includes('behandling') && !location.pathname.endsWith('behandling/');
