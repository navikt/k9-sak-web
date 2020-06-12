import { RouteProps } from 'react-router';

import { buildPath, formatQueryString, parseQueryString } from '@fpsak-frontend/utils';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';

export const fagsakPath = '/fagsak/:saksnummer/';
export const aktoerPath = '/aktoer/:aktoerId(\\d+)';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = saksnummer => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = saksnummer => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer, behandlingId) => buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = () => '/404';

const emptyQueryString = queryString => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

export const getLocationWithQueryParams = (location: RouteProps['location'], queryParams) => ({
  ...location,
  search: updateQueryParams(location.search, queryParams),
});

export const getSupportPanelLocationCreator = (location: RouteProps['location']) => supportPanel =>
  getLocationWithQueryParams(location, { stotte: supportPanel });
export const getProsessStegLocation = (location: RouteProps['location']) => behandlingspunkt =>
  getLocationWithQueryParams(location, { punkt: behandlingspunkt });
export const getFaktaLocation = (location: RouteProps['location']) => fakta =>
  getLocationWithQueryParams(location, { fakta });
export const getRiskPanelLocationCreator = (location: RouteProps['location']) => isRiskPanelOpen =>
  getLocationWithQueryParams(location, { risiko: isRiskPanelOpen });

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_PROSESS_STEG = 'default';

// eslint-disable-next-line
export const getLocationWithDefaultProsessStegAndFakta = (location: RouteProps['location']) =>
  getLocationWithQueryParams(location, { punkt: DEFAULT_PROSESS_STEG, fakta: DEFAULT_FAKTA });

export const getPathToFplos = () => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no') {
    return 'https://k9-los-web.nais.preprod.local/';
  }
  if (host === 'app.adeo.no') {
    return 'https://k9-los-web.nais.adeo.no/';
  }
  return null;
};

export const createLocationForSkjermlenke = (behandlingLocation, skjermlenkeCode) => {
  const skjermlenke = skjermlenkeCodes[skjermlenkeCode];
  return getLocationWithQueryParams(behandlingLocation, { punkt: skjermlenke.punktNavn, fakta: skjermlenke.faktaNavn });
};
