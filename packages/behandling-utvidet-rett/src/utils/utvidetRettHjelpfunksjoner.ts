import { Rammevedtak } from '@k9-sak-web/types';
import { RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { PersonopplysningerBasic } from '@k9-sak-web/types/src/personopplysningerTsType';

export const harBarnSoktForRammevedtakOmKroniskSyk = (
  barnSoktFor: PersonopplysningerBasic[],
  rammevedtak: Rammevedtak[],
): boolean => {
  const identBarnSoktFor: string = barnSoktFor.length > 0 ? barnSoktFor[0].fnr.substring(0, 6) : '';
  let finnesKSRammevedtakForBarnSoktFor = false;
  if (
    !!identBarnSoktFor &&
    rammevedtak.length > 0 &&
    typeof rammevedtak.find(
      rv => rv.type === RammevedtakEnum.UTVIDET_RETT && rv.utvidetRettFor === identBarnSoktFor,
    ) !== 'undefined'
  ) {
    finnesKSRammevedtakForBarnSoktFor = true;
  }
  return finnesKSRammevedtakForBarnSoktFor;
};
