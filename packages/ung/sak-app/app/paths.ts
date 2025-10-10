import { Location } from 'history';

import {
  pathToFagsak as v2PathToFagsak,
  pathToBehandlinger as v2PathToBehandlinger,
  pathToBehandling as v2PathToBehandling,
} from '@k9-sak-web/gui/utils/paths.js';
import { getPathToK9Los as v2GetPathToK9Los, goToLos as v2GoToLos } from '@k9-sak-web/lib/paths/paths.js';
import { pathWithQueryParams } from '@k9-sak-web/gui/utils/urlUtils.js';
import { isSkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import { createPathForSkjermlenke } from '@k9-sak-web/gui/utils/skjermlenke/createPathForSkjermlenke.js';

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_PROSESS_STEG = 'default';

export const aktoerRoutePath = '/aktoer/:aktoerId';

export const fagsakRoutePath = '/fagsak/:saksnummer//*';
export const behandlingerRoutePath = `behandling//*`;
export const behandlingRoutePath = `/:behandlingId/`;

export const pathToFagsak = v2PathToFagsak;
export const pathToBehandlinger = v2PathToBehandlinger;
export const pathToBehandling = v2PathToBehandling;
export const pathToMissingPage = (): string => '/404';

export const getSupportPanelLocationCreator =
  (location: Location) =>
  (supportPanel: string): Location =>
    pathWithQueryParams(location, { stotte: supportPanel });
export const getProsessStegLocation =
  (location: Location) =>
  (prosessSteg: string): Location =>
    pathWithQueryParams(location, { punkt: prosessSteg });
export const getFaktaLocation =
  (location: Location) =>
  (fakta: string): Location =>
    pathWithQueryParams(location, { fakta });
export const getRiskPanelLocationCreator =
  (location: Location) =>
  (isRiskPanelOpen): Location =>
    pathWithQueryParams(location, { risiko: isRiskPanelOpen });

// eslint-disable-next-line
export const getLocationWithDefaultProsessStegAndFakta = (location: Location): Location =>
  pathWithQueryParams(location, { punkt: DEFAULT_PROSESS_STEG, fakta: DEFAULT_FAKTA });

/**
 * @deprecated Bruk v2 versjon direkte
 */
export const getPathToK9Los = v2GetPathToK9Los;

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

/**
 * @deprecated Bruk createPathForSkjermlenke for ny kode der ein skjermlenkeType med korrekt Kodeverdi type tilgjengeleg.
 */
export const createLocationForSkjermlenke = (behandlingLocation: Location, skjermlenkeCode: string): Location => {
  if (isSkjermlenkeType(skjermlenkeCode)) {
    return createPathForSkjermlenke(behandlingLocation, skjermlenkeCode);
  }
  return pathWithQueryParams(behandlingLocation, { punkt: 'default', fakta: 'default' });
};

// Kan gå inn på url som ser sånn ut "http://localhost:9000/k9/web/fagsak/", men
// da vil ein automatisk redirecte til http://localhost:9000/k9/web/fagsak/behandling/*"
export const erUrlUnderBehandling = (location: Location): boolean => !location.pathname.includes('behandling/');

export const erBehandlingValgt = (location: Location): boolean =>
  location.pathname.includes('behandling') && !location.pathname.endsWith('behandling/');

/**
 * @deprecated Bruk v2 versjon direkte
 */
export const goToLos = v2GoToLos;
