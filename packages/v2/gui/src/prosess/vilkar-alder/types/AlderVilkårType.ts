import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';

export type AlderVilkårType = {
  lovReferanse?: string;
  perioder?: Array<VilkårPeriodeDto>;
  vilkarType: string;
  vurdertAv: string;
};
