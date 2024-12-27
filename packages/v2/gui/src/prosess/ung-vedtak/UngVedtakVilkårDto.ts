import type { VilkårMedPerioderDto, VilkårPeriodeDto } from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakVilkårPeriodeDto = {
  avslagKode: VilkårPeriodeDto['avslagKode'];
  vilkarStatus: VilkårPeriodeDto['vilkarStatus'];
};

export type UngVedtakVilkårDto = {
  vilkarType: VilkårMedPerioderDto['vilkarType'];
  perioder: UngVedtakVilkårPeriodeDto[];
};
