import { buildPath } from './urlUtils.js';
import { isValidUuid } from './validation/uuid.js';

export const fagsakPath = '/fagsak/:saksnummer/';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingIdOrUuid/`;

export const pathToFagsak = (saksnummer: string): string => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = (saksnummer: string): string => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer: string, behandlingIdOrUuid: number | string): string =>
  buildPath(behandlingPath, { saksnummer, behandlingIdOrUuid });

export const gyldigBehandlingId = (behandlingIdOrUuid: string | undefined): number | undefined => {
  const num = Number.parseInt(behandlingIdOrUuid ?? '');
  if (Number.isFinite(num) && num >= 0) {
    return num;
  }
  return undefined;
};

export const gyldigBehandlingUuid = (behandlingIdOrUuid: string | undefined): string | undefined => {
  if (isValidUuid(behandlingIdOrUuid?.trim() ?? '')) {
    return behandlingIdOrUuid?.trim();
  }
  return undefined;
};
