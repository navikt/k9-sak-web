import { Location } from 'history';

import {
  pathToBehandling as v2PathToBehandling,
  pathToBehandlinger as v2PathToBehandlinger,
  pathToFagsak as v2PathToFagsak,
} from '@k9-sak-web/gui/utils/paths.js';
import { pathWithQueryParams } from '@k9-sak-web/gui/utils/urlUtils.js';

const DEFAULT_FAKTA = 'default';
const DEFAULT_PROSESS_STEG = 'default';

export const fagsakRoutePath = '/fagsak/:saksnummer//*';
export const behandlingerRoutePath = `behandling//*`;

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

// eslint-disable-next-line
export const getLocationWithDefaultProsessStegAndFakta = (location: Location): Location =>
  pathWithQueryParams(location, { punkt: DEFAULT_PROSESS_STEG, fakta: DEFAULT_FAKTA });

// Kan gå inn på url som ser sånn ut "http://localhost:9000/k9/web/fagsak/", men
// da vil ein automatisk redirecte til http://localhost:9000/k9/web/fagsak/behandling/*"
export const erUrlUnderBehandling = (location: Location): boolean => !location.pathname.includes('behandling/');

export const erBehandlingValgt = (location: Location): boolean =>
  location.pathname.includes('behandling') && !location.pathname.endsWith('behandling/');
