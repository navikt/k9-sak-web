import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export const erFagytelseTypeUtvidetRett = (fagytelseType: FagsakYtelsesType) => {
  switch (fagytelseType) {
    case fagsakYtelsesType.OMSORGSPENGER_AO:
    case fagsakYtelsesType.OMSORGSPENGER_MA:
    case fagsakYtelsesType.OMSORGSPENGER_KS:
      return true;
    default:
      return false;
  }
};
