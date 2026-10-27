import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import * as messages from '../nb_NO';

export const teksterForSakstype = (sakstype: FagsakYtelsesType) => {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
