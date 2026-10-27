import type { RettFraDagEnVisningDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/RettFraDagEnVisningDto.js';

export type { RettFraDagEnVisningDto };

export interface TiDagerBackendApiType {
  hentRettFraDagEnOpplysninger(behandlingUuid: string): Promise<RettFraDagEnVisningDto>;
}
