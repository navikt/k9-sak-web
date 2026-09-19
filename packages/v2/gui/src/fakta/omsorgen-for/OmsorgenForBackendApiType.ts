import type { k9_sak_kontrakt_omsorg_OmsorgenForOversiktDto as OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type OmsorgenForBackendApiType = {
  getOmsorgsperioder(behandlingUuid: string): Promise<OmsorgenForOversiktDto>;
};
