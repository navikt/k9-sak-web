import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import {PersonopplysningerBasic} from "@k9-sak-web/types/src/personopplysningerTsType";
import {Rammevedtak} from "@k9-sak-web/types";
import {RammevedtakEnum} from "@k9-sak-web/types/src/omsorgspenger/Rammevedtak";

export const erFagytelseTypeUtvidetRett = (fagytelseType: string) => {
  switch (fagytelseType) {
    case FagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN:
    case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE:
    case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN:
      return true;
    default:
      return false;
  }
};

export const harBarnSoktForRammevedtakOmKroniskSyk = (barnSoktFor: PersonopplysningerBasic[], rammevedtak: Rammevedtak[]): boolean => {
  const identBarnSoktFor: string = barnSoktFor.length > 0 ? barnSoktFor[0].fnr.substring(0, 6) : '';
  let finnesKSRammevedtakForBarnSoktFor = false;
  if(!!identBarnSoktFor
    && rammevedtak.length > 0
    && typeof rammevedtak.find(rv => rv.type === RammevedtakEnum.UTVIDET_RETT && rv.utvidetRettFor === identBarnSoktFor) !== 'undefined'){
    finnesKSRammevedtakForBarnSoktFor = true;
  }
  return finnesKSRammevedtakForBarnSoktFor;
};

