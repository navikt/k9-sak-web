import { lookupSkjermlenkeCode, type SkjermlenkeTypeWithExtraCodes } from './skjermlenkeCodes.js';
import { pathWithQueryParams } from '../urlUtils.js';
import type { Path } from 'react-router';

export const createPathForSkjermlenke = <T extends Partial<Path>>(
  behandlingLocation: T,
  skjermlenkeType: SkjermlenkeTypeWithExtraCodes,
): T => {
  const skjermlenkeCode = lookupSkjermlenkeCode(skjermlenkeType);
  const qp = skjermlenkeCode
    ? {
        punkt: skjermlenkeCode?.punktNavn,
        fakta: skjermlenkeCode?.faktaNavn,
        tab: skjermlenkeCode?.tabNavn,
      }
    : {
        punkt: 'default',
        fakta: 'default',
      };
  return pathWithQueryParams(behandlingLocation, qp);
};
