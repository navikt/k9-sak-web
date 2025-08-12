import {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_frisinn_AvslagsårsakPrPeriodeDto as AvslagsårsakPrPeriodeDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto as BeregningsgrunnlagDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_YtelsespesifiktGrunnlagDto as YtelsespesifiktGrunnlagDto,
} from '@navikt/k9-sak-typescript-client';

export type Beregningsgrunnlag = BeregningsgrunnlagDto & {
  ytelsesspesifiktGrunnlag?: YtelsespesifiktGrunnlagDto & {
    avslagsårsakPrPeriode?: Array<AvslagsårsakPrPeriodeDto>;
  };
};
