import type { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/generated';
import { k9_kodeverk_vilkår_Utfall as VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/generated';
import { k9_kodeverk_vilkår_VilkårType as VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/k9sak/generated';

export const finnVilkår = (vilkår: VilkårMedPerioderDto[] | undefined, vilkårType: VilkårMedPerioderDtoVilkarType) => {
  return vilkår?.find(v => v.vilkarType === vilkårType);
};

export const vilkårErOppfylt = (vilkår?: VilkårMedPerioderDto) => {
  if (!vilkår?.perioder || vilkår.perioder.length === 0) {
    return false;
  }
  return vilkår.perioder.every(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT);
};

export const vilkårErIkkeOppfylt = (vilkår?: VilkårMedPerioderDto) => {
  if (!vilkår?.perioder || vilkår.perioder.length === 0) {
    return true;
  }
  return vilkår.perioder.every(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT);
};

export const vilkårErIkkeVurdert = (vilkår?: VilkårMedPerioderDto) => {
  if (!vilkår?.perioder || vilkår.perioder.length === 0) {
    return true;
  }
  return vilkår.perioder.every(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_VURDERT);
};

export const harVilkårsperioder = (vilkår?: VilkårMedPerioderDto) => {
  return !!(vilkår?.perioder && vilkår.perioder.length > 0);
};

export const harBådeOppfylteOgIkkeOppfyltePerioder = (vilkår?: VilkårMedPerioderDto) => {
  if (!vilkår?.perioder || vilkår.perioder.length === 0) {
    return false;
  }
  return (
    vilkår.perioder.some(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT) &&
    vilkår.perioder.some(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT)
  );
};
