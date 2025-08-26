import {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_frisinn_AvslagsårsakPrPeriodeDto as AvslagsårsakPrPeriodeDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto as BeregningsgrunnlagDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_YtelsespesifiktGrunnlagDto as YtelsespesifiktGrunnlagDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type Beregningsgrunnlag = BeregningsgrunnlagDto & {
  ytelsesspesifiktGrunnlag?: YtelsespesifiktGrunnlagDto & {
    avslagsårsakPrPeriode?: Array<AvslagsårsakPrPeriodeDto>;
  };
};
