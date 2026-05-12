import type { k9_sak_kontrakt_inngangsvilkår_RettFraDagEnVisningDto as RettFraDagEnVisningDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type { RettFraDagEnVisningDto };

export interface TiDagerBackendApiType {
  hentRettFraDagEnOpplysninger(behandlingUuid: string): Promise<RettFraDagEnVisningDto>;
}
