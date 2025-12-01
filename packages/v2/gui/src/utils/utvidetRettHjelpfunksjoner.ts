import { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';

export const erFagytelseTypeUtvidetRett = (fagytelseType: FagsakYtelseType) => {
  switch (fagytelseType) {
    case FagsakYtelseType.OMSORGSPENGER_AO:
    case FagsakYtelseType.OMSORGSPENGER_MA:
    case FagsakYtelseType.OMSORGSPENGER_KS:
      return true;
    default:
      return false;
  }
};
