import type { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as K9SakVilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ung_sak_kontrakt_vilkår_VilkårMedPerioderDto as UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type { K9SakVilkårMedPerioderDto, UngSakVilkårMedPerioderDto };

export type VilkårMedPerioderDto = K9SakVilkårMedPerioderDto | UngSakVilkårMedPerioderDto;
