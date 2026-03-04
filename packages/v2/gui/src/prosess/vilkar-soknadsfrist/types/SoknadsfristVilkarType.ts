import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';

export type SoknadsfristVilkarType = { lovReferanse?: string; perioder?: Array<VilkårPeriodeDto> };
