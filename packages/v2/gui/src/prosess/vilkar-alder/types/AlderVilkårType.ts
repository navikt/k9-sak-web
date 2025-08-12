import type { k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export type AlderVilkårType = {
  lovReferanse?: string;
  perioder?: Array<VilkårPeriodeDto>;
  vilkarType: string;
  vurdertAv: string;
};
