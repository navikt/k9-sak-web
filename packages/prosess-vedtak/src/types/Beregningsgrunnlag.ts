import type { AvslagsårsakPrPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/AvslagsårsakPrPeriodeDto.js';
import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/k9sak/kontrakt/BeregningsgrunnlagDto.js';
import type { YtelsespesifiktGrunnlagDto } from '@k9-sak-web/backend/k9sak/kontrakt/YtelsespesifiktGrunnlagDto.js';

export type Beregningsgrunnlag = BeregningsgrunnlagDto & {
  ytelsesspesifiktGrunnlag?: YtelsespesifiktGrunnlagDto & {
    avslagsårsakPrPeriode?: Array<AvslagsårsakPrPeriodeDto>;
  };
};
