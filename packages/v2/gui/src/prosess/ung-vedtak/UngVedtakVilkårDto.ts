import type {
  ung_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
  ung_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type UngVedtakVilkårPeriodeDto = {
  avslagKode: VilkårPeriodeDto['avslagKode'];
  vilkarStatus: VilkårPeriodeDto['vilkarStatus'];
};

export type UngVedtakVilkårDto = Pick<VilkårMedPerioderDto, 'vilkarType' | 'perioder'>;
