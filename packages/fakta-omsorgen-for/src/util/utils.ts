import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import * as messages from '../nb_NO';

export const teksterForSakstype = (sakstype: FagsakYtelsesType) => {
  if (sakstype === fagsakYtelsesType.PSB) {
    return messages.pleiepenger;
  }

  if (sakstype === fagsakYtelsesType.OMP) {
    return messages.omsorgspenger;
  }
  return messages.pleiepenger;
};
