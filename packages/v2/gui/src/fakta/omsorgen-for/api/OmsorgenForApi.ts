import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmsorgenForApi extends BackendTilhørighet {
  getOmsorgsperioder(behandlingUuid: string): Promise<OmsorgenForOversiktDto>;
}
