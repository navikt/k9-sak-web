import {
  AvslagsårsakPrPeriodeDto,
  BeregningsgrunnlagDto,
  YtelsespesifiktGrunnlagDto,
} from '@navikt/k9-sak-typescript-client';

export type Beregningsgrunnlag = BeregningsgrunnlagDto & {
  ytelsesspesifiktGrunnlag?: YtelsespesifiktGrunnlagDto & {
    avslagsårsakPrPeriode?: Array<AvslagsårsakPrPeriodeDto>;
  };
};
