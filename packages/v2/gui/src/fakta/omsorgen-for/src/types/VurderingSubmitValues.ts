import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';

export type VurderingSubmitValues = {
  periode: Periode | undefined;
  resultat: NonNullable<OmsorgenForDto['resultat']>;
  begrunnelse: string;
};
