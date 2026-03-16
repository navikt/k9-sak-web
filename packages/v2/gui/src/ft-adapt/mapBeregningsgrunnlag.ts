import type {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagArbeidsforholdDto as BeregningsgrunnlagArbeidsforholdDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto as BeregningsgrunnlagDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagPeriodeDto as BeregningsgrunnlagPeriodeDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagPrStatusOgAndelDto as BeregningsgrunnlagPrStatusOgAndelDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_EgenNæringDto as EgenNæringDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_FaktaOmBeregningDto as FaktaOmBeregningDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_FordelingDto as FordelingDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_inntektsgrunnlag_InntektsgrunnlagDto as InntektsgrunnlagDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_PgiDto as PgiDto,
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_refusjon_RefusjonTilVurderingDto as RefusjonTilVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { folketrygdloven_kalkulus_kodeverk_VirksomhetType as VirksomhetType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  AndelForFaktaOmBeregning as FPAndelForFaktaOmBeregning,
  Beregningsgrunnlag as FPBeregningsgrunnlag,
  BeregningsgrunnlagAndel as FPBeregningsgrunnlagAndel,
  BeregningsgrunnlagArbeidsforhold as FPBeregningsgrunnlagArbeidsforhold,
  BeregningsgrunnlagPeriodeProp as FPBeregningsgrunnlagPeriode,
  FaktaOmBeregning as FPFaktaOmBeregning,
  FaktaOmFordeling as FPFaktaOmFordeling,
  Inntektsgrunnlag as FPInntektsgrunnlag,
  Næring as FPNæring,
  PgiVerdier as FPPgiVerdier,
  RefusjonTilVurderingAndel as FPRefusjonTilVurderingAndel,
  SammenligningsgrunlagProp as FPSammenligningsgrunnlag,
  SammenligningType,
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

const mapSammenligningsgrunnlag = (
  inp: NonNullable<BeregningsgrunnlagDto['sammenligningsgrunnlagPrStatus']>[number],
): FPSammenligningsgrunnlag => ({
  sammenligningsgrunnlagType: (inp.sammenligningsgrunnlagType ?? '') as SammenligningType,
  differanseBeregnet: inp.differanseBeregnet ?? 0,
  avvikProsent: inp.avvikProsent ?? 0,
  avvikPromille: inp.avvikPromille ?? 0,
  rapportertPrAar: inp.rapportertPrAar ?? 0,
  sammenligningsgrunnlagFom: inp.sammenligningsgrunnlagFom ?? '',
  sammenligningsgrunnlagTom: inp.sammenligningsgrunnlagTom ?? '',
});

const mapFaktaOmBeregning = (inp: FaktaOmBeregningDto): FPFaktaOmBeregning => ({
  ...inp,
  andelerForFaktaOmBeregning: (inp.andelerForFaktaOmBeregning ?? []).map(a => ({
    ...a,
    aktivitetStatus: (a.aktivitetStatus ?? '') as FPAndelForFaktaOmBeregning['aktivitetStatus'],
    lagtTilAvSaksbehandler: a.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
  })),
  frilansAndel:
    inp.frilansAndel != null
      ? {
          ...inp.frilansAndel,
          arbeidsforhold:
            inp.frilansAndel.arbeidsforhold != null ? mapArbeidsforhold(inp.frilansAndel.arbeidsforhold) : undefined,
        }
      : undefined,
  arbeidsforholdMedLønnsendringUtenIM: inp.arbeidsforholdMedLønnsendringUtenIM?.map(a => ({
    ...a,
    arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
  })),
  kortvarigeArbeidsforhold: inp.kortvarigeArbeidsforhold?.map(a => ({
    ...a,
    aktivitetStatus: (a.aktivitetStatus ?? '') as FPAndelForFaktaOmBeregning['aktivitetStatus'],
    lagtTilAvSaksbehandler: a.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
  })),
  kunYtelse:
    inp.kunYtelse != null
      ? {
          ...inp.kunYtelse,
          fodendeKvinneMedDP: inp.kunYtelse.fodendeKvinneMedDP ?? false,
          andeler: inp.kunYtelse.andeler?.map(a => ({
            ...a,
            fastsattBelopPrMnd: a.fastsattBelopPrMnd ?? null,
            arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
          })),
        }
      : undefined,
  vurderMottarYtelse:
    inp.vurderMottarYtelse != null
      ? {
          ...inp.vurderMottarYtelse,
          arbeidstakerAndelerUtenIM: inp.vurderMottarYtelse.arbeidstakerAndelerUtenIM?.map(a => ({
            ...a,
            lagtTilAvSaksbehandler: a.lagtTilAvSaksbehandler ?? false,
            arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
          })),
        }
      : undefined,
  arbeidstakerOgFrilanserISammeOrganisasjonListe: inp.arbeidstakerOgFrilanserISammeOrganisasjonListe?.map(a => ({
    ...a,
    arbeidsforhold: a.arbeidsforhold != null ? mapArbeidsforhold(a.arbeidsforhold) : undefined,
  })),
  saksopplysninger: inp.saksopplysninger
    ? {
        ...inp.saksopplysninger,
        kortvarigeArbeidsforhold: (inp.saksopplysninger.kortvarigeArbeidsforhold ?? []).map(k => ({
          andelsnr: k.andelsnr ?? 0,
          arbeidsgiverIdent: k.arbeidsgiverIdent ?? '',
          arbeidsforholdId: k.arbeidsforholdId,
        })),
        lønnsendringSaksopplysning: inp.saksopplysninger.lønnsendringSaksopplysning?.map(l => ({
          ...l,
          arbeidsforhold: {
            ...l.arbeidsforhold,
            andelsnr: l.arbeidsforhold.andelsnr ?? 0,
            arbeidsgiverIdent: l.arbeidsforhold.arbeidsgiverIdent ?? '',
          },
        })),
      }
    : undefined,
});

const mapVurderNyttInntektsforholdDto = (
  inp: NonNullable<FordelingDto['vurderNyttInntektsforholdDto']>,
): NonNullable<FPFaktaOmFordeling['vurderNyttInntektsforholdDto']> => ({
  ...inp,
  vurderInntektsforholdPerioder: inp.vurderInntektsforholdPerioder?.map(periode => ({
    ...periode,
    inntektsforholdListe: (periode.inntektsforholdListe ?? []).map(forhold => ({
      ...forhold,
      aktivitetStatus: (forhold.aktivitetStatus ?? '') as FPAndelForFaktaOmBeregning['aktivitetStatus'],
      arbeidsforholdId: forhold.arbeidsforholdId ?? '',
      arbeidsgiverId: forhold.arbeidsgiverId ?? '',
      skalRedusereUtbetaling: forhold.skalRedusereUtbetaling ?? false,
    })),
  })),
});

const mapFaktaOmFordeling = (inp: FordelingDto): FPFaktaOmFordeling => ({
  fordelBeregningsgrunnlag: inp.fordelBeregningsgrunnlag
    ? {
        ...inp.fordelBeregningsgrunnlag,
        fordelBeregningsgrunnlagPerioder: inp.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder?.map(
          periode => ({
            ...periode,
            fordelBeregningsgrunnlagAndeler: periode.fordelBeregningsgrunnlagAndeler?.map(andel => ({
              ...andel,
              arbeidsforhold: andel.arbeidsforhold != null ? mapArbeidsforhold(andel.arbeidsforhold) : undefined,
            })),
          }),
        ),
      }
    : undefined,
  vurderNyttInntektsforholdDto:
    inp.vurderNyttInntektsforholdDto != null
      ? mapVurderNyttInntektsforholdDto(inp.vurderNyttInntektsforholdDto)
      : undefined,
});

const mapRefusjonAndel = (inp: RefusjonTilVurderingDto['andeler'][number]): FPRefusjonTilVurderingAndel => ({
  ...inp,
  nyttRefusjonskravFom: inp.nyttRefusjonskravFom ?? '',
  tidligsteMuligeRefusjonsdato: inp.tidligsteMuligeRefusjonsdato ?? '',
  skalKunneFastsetteDelvisRefusjon: inp.skalKunneFastsetteDelvisRefusjon ?? false,
});

const mapRefusjonTilVurdering = (
  inp: RefusjonTilVurderingDto,
): NonNullable<FPBeregningsgrunnlag['refusjonTilVurdering']> => ({
  andeler: inp.andeler.map(mapRefusjonAndel),
});

const mapInntektsgrunnlagInntekt = (
  i: NonNullable<InntektsgrunnlagDto['beregningsgrunnlagInntekter'][number]['inntekter']>[number],
): FPInntektsgrunnlag['beregningsgrunnlagInntekter'][number]['inntekter'][number] => {
  if (i.inntektAktivitetType === 'ARBEIDSTAKERINNTEKT') {
    return {
      inntektAktivitetType: 'ARBEIDSTAKERINNTEKT',
      arbeidsgiverIdent: i.arbeidsgiverIdent ?? '',
      beløp: i.beløp ?? 0,
    };
  }
  return {
    inntektAktivitetType: (i.inntektAktivitetType ?? 'FRILANSINNTEKT') as 'FRILANSINNTEKT' | 'YTELSEINNTEKT',
    beløp: i.beløp ?? 0,
  };
};

const mapInntektsgrunnlagMåned = (
  inp: InntektsgrunnlagDto['beregningsgrunnlagInntekter'][number],
): FPInntektsgrunnlag['beregningsgrunnlagInntekter'][number] => ({
  ...inp,
  inntekter: (inp.inntekter ?? []).map(mapInntektsgrunnlagInntekt),
});

const mapPgiGrunnlag = (
  inp: InntektsgrunnlagDto['pgiGrunnlag'][number],
): FPInntektsgrunnlag['pgiGrunnlag'][number] => ({
  ...inp,
  inntekter: (inp.inntekter ?? []).map(i => ({
    ...i,
    beløp: i.beløp ?? 0,
  })),
});

const mapInntektsgrunnlag = (inp: InntektsgrunnlagDto): FPInntektsgrunnlag => ({
  beregningsgrunnlagInntekter: inp.beregningsgrunnlagInntekter.map(mapInntektsgrunnlagMåned),
  sammenligningsgrunnlagInntekter: inp.sammenligningsgrunnlagInntekter.map(mapInntektsgrunnlagMåned),
  pgiGrunnlag: inp.pgiGrunnlag.map(mapPgiGrunnlag),
});

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
    sammenligningsgrunnlagPrStatus: bg.sammenligningsgrunnlagPrStatus?.map(mapSammenligningsgrunnlag),
    faktaOmBeregning: bg.faktaOmBeregning != null ? mapFaktaOmBeregning(bg.faktaOmBeregning) : undefined,
    faktaOmFordeling: bg.faktaOmFordeling != null ? mapFaktaOmFordeling(bg.faktaOmFordeling) : undefined,
    ytelsesspesifiktGrunnlag: bg.ytelsesspesifiktGrunnlag,
    refusjonTilVurdering:
      bg.refusjonTilVurdering != null ? mapRefusjonTilVurdering(bg.refusjonTilVurdering) : undefined,
    inntektsgrunnlag: bg.inntektsgrunnlag != null ? mapInntektsgrunnlag(bg.inntektsgrunnlag) : undefined,
    forlengelseperioder: bg.forlengelseperioder,
  };
};
