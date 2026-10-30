import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BarnType, type BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { Personopplysninger } from '@k9-sak-web/types';

// Kronisk sykt barn viser barnet det er søkt for, andre utvidet rett-saker viser søkerens registrerte barn
export const barnForUtvidetRett = (
  personopplysninger: Personopplysninger | undefined,
  fagsakYtelseType: FagsakYtelsesType | undefined,
): BarnDto[] => {
  const barn =
    fagsakYtelseType === fagsakYtelsesType.OMSORGSPENGER_KS
      ? personopplysninger?.barnSoktFor
      : personopplysninger?.barn;
  return (barn ?? []).map(({ fnr, fodselsdato }) => ({
    personIdent: fnr,
    fødselsdato: fodselsdato,
    barnType: BarnType.VANLIG,
  }));
};
