import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';

export type AktivitetspengerBeregningBackendApiType = {
  getBeregningsgrunnlag(behandlingUuid: string): Promise<BeregningsgrunnlagDto>;
};
