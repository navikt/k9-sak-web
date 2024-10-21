import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export type SoknadsfristVilkarType = { lovReferanse?: string; perioder?: Array<VilkårPeriodeDto> };
