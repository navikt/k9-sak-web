import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import * as messages from '../nb_NO';

export const teksterForSakstype = (sakstype?: FagsakYtelsesType) => {
  if (sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
    return messages.pleiepenger;
  }

  if (sakstype === fagsakYtelsesType.OMSORGSPENGER) {
    return messages.omsorgspenger;
  }
  if (sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return messages.opplaeringspenger;
  }
  return messages.pleiepenger;
};
