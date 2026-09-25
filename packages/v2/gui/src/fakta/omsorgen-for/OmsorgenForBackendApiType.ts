import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';

export type OmsorgenForBackendApiType = {
  getOmsorgsperioder(behandlingUuid: string): Promise<OmsorgenForOversiktDto>;
};
