import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårPeriodeDto.js';

export type UngVedtakVilkårPeriodeDto = {
  avslagKode: VilkårPeriodeDto['avslagKode'];
  vilkarStatus: VilkårPeriodeDto['vilkarStatus'];
};

export type UngVedtakVilkårDto = {
  vilkarType: VilkårMedPerioderDto['vilkarType'];
  perioder: UngVedtakVilkårPeriodeDto[];
};
