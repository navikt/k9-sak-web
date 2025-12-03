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
  if (behandlingIdOrUuid != null) {
    const isOnlyDigits = /^[0-9]+$/.test(behandlingIdOrUuid.trim());
    if (isOnlyDigits) {
      const num = Number.parseInt(behandlingIdOrUuid, 10);
      if (Number.isInteger(num) && num >= 0) {
        return num;
      }
    }
  }
  return undefined;
};

export const gyldigBehandlingUuid = (behandlingIdOrUuid: string | undefined): string | undefined => {
  const trimmedBehandlingOrUuid = behandlingIdOrUuid?.trim() ?? '';
  if (isValidUuid(trimmedBehandlingOrUuid)) {
    return trimmedBehandlingOrUuid;
  }
  return undefined;
};
