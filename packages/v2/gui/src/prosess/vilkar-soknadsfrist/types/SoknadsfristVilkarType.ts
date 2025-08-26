import type { k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type SoknadsfristVilkarType = { lovReferanse?: string; perioder?: Array<VilkårPeriodeDto> };
