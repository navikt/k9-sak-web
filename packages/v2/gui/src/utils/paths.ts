import { buildPath } from './urlUtils.js';

export const fagsakPath = '/fagsak/:saksnummer/';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingIdOrUuid/`;

export const pathToFagsak = (saksnummer: string): string => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = (saksnummer: string): string => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer: string, behandlingIdOrUuid: number | string): string =>
  buildPath(behandlingPath, { saksnummer, behandlingIdOrUuid });
