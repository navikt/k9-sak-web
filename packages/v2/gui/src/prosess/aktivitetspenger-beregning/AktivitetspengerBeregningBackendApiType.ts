import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';

export type AktivitetspengerBeregningBackendApiType = {
  getBeregningsgrunnnlag(behandlingUuid: string): Promise<BeregningsgrunnlagDto>;
};
