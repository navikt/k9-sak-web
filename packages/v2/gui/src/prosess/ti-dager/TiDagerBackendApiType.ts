import type { RettFraDagEnVisningDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/RettFraDagEnVisningDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export type { RettFraDagEnVisningDto };

export interface TiDagerBackendApiType extends BackendTilhørighet {
  hentRettFraDagEnOpplysninger(behandlingUuid: string): Promise<RettFraDagEnVisningDto>;
}
