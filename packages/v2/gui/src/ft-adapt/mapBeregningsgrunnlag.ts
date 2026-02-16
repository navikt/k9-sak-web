import { folketrygdloven_kalkulus_kodeverk_VirksomhetType as VirksomhetType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_EgenNæringDto as EgenNæringDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_PgiDto as PgiDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagArbeidsforholdDto as BeregningsgrunnlagArbeidsforholdDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagPrStatusOgAndelDto as BeregningsgrunnlagPrStatusOgAndelDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto as BeregningsgrunnlagDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagPeriodeDto as BeregningsgrunnlagPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  Beregningsgrunnlag as FPBeregningsgrunnlag,
  BeregningsgrunnlagPeriodeProp as FPBeregningsgrunnlagPeriode,
  BeregningsgrunnlagAndel as FPBeregningsgrunnlagAndel,
  BeregningsgrunnlagArbeidsforhold as FPBeregningsgrunnlagArbeidsforhold,
  PgiVerdier as FPPgiVerdier,
  Næring as FPNæring,
} from '@navikt/ft-types';

const mapArbeidsforhold = (af: BeregningsgrunnlagArbeidsforholdDto): FPBeregningsgrunnlagArbeidsforhold => {
  return {
    ...af,
    arbeidsforholdType: af.arbeidsforholdType ?? '-',
  };
};

const mapPgiDto = (inp: PgiDto): FPPgiVerdier => {
  if (inp.beløp != null && inp.årstall != null) {
    return {
      beløp: inp.beløp,
      årstall: inp.årstall,
    };
  }
  throw new Error(`PgiDto beløp og årstall må vere definert`);
};

const mapNæringer = (inp: EgenNæringDto): FPNæring => {
  return {
    ...inp,
    orgnr: inp.orgnr ?? '',
    virksomhetType: inp.virksomhetType ?? VirksomhetType.UDEFINERT,
  };
};

const mapBeregningsgrunnlagPrStatusOgAndelTilFP = (
  inp: BeregningsgrunnlagPrStatusOgAndelDto,
): FPBeregningsgrunnlagAndel => {
  if (inp.andelsnr == null) {
    throw new Error('BeregningsgrunnlagPrStatusOgAndelDto.andelsnr skal aldri vere null');
  }
  return {
    ...inp,
    arbeidsforhold: inp.arbeidsforhold != null ? mapArbeidsforhold(inp.arbeidsforhold) : undefined,
    andelsnr: inp.andelsnr,
    pgiVerdier: 'pgiVerdier' in inp ? inp.pgiVerdier?.map(mapPgiDto) : undefined,
    næringer: 'næringer' in inp ? inp.næringer?.map(mapNæringer) : undefined,
  };
};

const mapBeregningsgrunnlagPeriodeTilFP = (periode: BeregningsgrunnlagPeriodeDto): FPBeregningsgrunnlagPeriode => {
  return {
    ...periode,
    beregningsgrunnlagPeriodeFom: periode.beregningsgrunnlagPeriodeFom ?? '',
    beregningsgrunnlagPeriodeTom: periode.beregningsgrunnlagPeriodeTom ?? '',
    beregningsgrunnlagPrStatusOgAndel: periode.beregningsgrunnlagPrStatusOgAndel?.map(
      mapBeregningsgrunnlagPrStatusOgAndelTilFP,
    ),
  };
};

export const mapBeregningsgrunnlagTilFP = (bg: BeregningsgrunnlagDto): FPBeregningsgrunnlag => {
  if (bg.grunnbeløp == null) {
    throw new Error(`Beregningsgrunnlag.grunnbeløp kan ikke være udefinert`);
  }
  return {
    vilkårsperiodeFom: bg.vilkårsperiodeFom ?? '',
    avklaringsbehov: bg.avklaringsbehov,
    skjaeringstidspunktBeregning: bg.skjaeringstidspunktBeregning,
    dekningsgrad: bg.dekningsgrad,
    grunnbeløp: bg.grunnbeløp,
    erOverstyrtInntekt: bg.erOverstyrtInntekt,
    aktivitetStatus: bg.aktivitetStatus,
    beregningsgrunnlagPeriode: bg.beregningsgrunnlagPeriode?.map(mapBeregningsgrunnlagPeriodeTilFP),
  };
};
