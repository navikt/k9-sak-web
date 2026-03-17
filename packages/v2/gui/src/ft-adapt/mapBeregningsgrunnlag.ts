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
} from '@navikt/ft-types';

const mapArbeidsforhold = (af: BeregningsgrunnlagArbeidsforholdDto): FPBeregningsgrunnlagArbeidsforhold => ({
  ...af,
  arbeidsforholdType: af.arbeidsforholdType ?? '-',
});

const mapOptionalArbeidsforhold = (
  af: BeregningsgrunnlagArbeidsforholdDto | undefined | null,
): FPBeregningsgrunnlagArbeidsforhold | undefined => (af != null ? mapArbeidsforhold(af) : undefined);

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
    arbeidsforhold: mapOptionalArbeidsforhold(inp.arbeidsforhold),
    andelsnr: inp.andelsnr,
    pgiVerdier: inp.dtoType === 'SN' ? inp.pgiVerdier?.map(mapPgiDto) : undefined,
    næringer: inp.dtoType === 'SN' ? inp.næringer?.map(mapNæringer) : undefined,
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
): FPSammenligningsgrunnlag => {
  if (!inp.sammenligningsgrunnlagType) {
    throw new Error('sammenligningsgrunnlagType må være definert');
  }
  return {
    sammenligningsgrunnlagType: inp.sammenligningsgrunnlagType,
    differanseBeregnet: inp.differanseBeregnet ?? 0,
    avvikProsent: inp.avvikProsent ?? 0,
    avvikPromille: inp.avvikPromille ?? 0,
    rapportertPrAar: inp.rapportertPrAar ?? 0,
    sammenligningsgrunnlagFom: inp.sammenligningsgrunnlagFom ?? '',
    sammenligningsgrunnlagTom: inp.sammenligningsgrunnlagTom ?? '',
  };
};

const mapFaktaOmBeregning = (inp: FaktaOmBeregningDto): FPFaktaOmBeregning => ({
  ...inp,
  andelerForFaktaOmBeregning: (inp.andelerForFaktaOmBeregning ?? []).map(andel => ({
    ...andel,
    aktivitetStatus: andel.aktivitetStatus ?? '-',
    lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
  })),
  frilansAndel:
    inp.frilansAndel != null
      ? {
          ...inp.frilansAndel,
          arbeidsforhold: mapOptionalArbeidsforhold(inp.frilansAndel.arbeidsforhold),
        }
      : undefined,
  arbeidsforholdMedLønnsendringUtenIM: inp.arbeidsforholdMedLønnsendringUtenIM?.map(arbeidsforhold => ({
    ...arbeidsforhold,
    arbeidsforhold: mapOptionalArbeidsforhold(arbeidsforhold.arbeidsforhold),
  })),
  kortvarigeArbeidsforhold: inp.kortvarigeArbeidsforhold?.map(arbeidsforhold => ({
    ...arbeidsforhold,
    aktivitetStatus: arbeidsforhold.aktivitetStatus ?? '-',
    lagtTilAvSaksbehandler: arbeidsforhold.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: mapOptionalArbeidsforhold(arbeidsforhold.arbeidsforhold),
  })),
  kunYtelse:
    inp.kunYtelse != null
      ? {
          ...inp.kunYtelse,
          fodendeKvinneMedDP: inp.kunYtelse.fodendeKvinneMedDP ?? false,
          andeler: inp.kunYtelse.andeler?.map(andel => ({
            ...andel,
            fastsattBelopPrMnd: andel.fastsattBelopPrMnd ?? null,
            arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
          })),
        }
      : undefined,
  vurderMottarYtelse:
    inp.vurderMottarYtelse != null
      ? {
          ...inp.vurderMottarYtelse,
          arbeidstakerAndelerUtenIM: inp.vurderMottarYtelse.arbeidstakerAndelerUtenIM?.map(andel => ({
            ...andel,
            lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler ?? false,
            arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
          })),
        }
      : undefined,
  arbeidstakerOgFrilanserISammeOrganisasjonListe: inp.arbeidstakerOgFrilanserISammeOrganisasjonListe?.map(
    arbeidstakerOgFrilanser => ({
      ...arbeidstakerOgFrilanser,
      arbeidsforhold: mapOptionalArbeidsforhold(arbeidstakerOgFrilanser.arbeidsforhold),
    }),
  ),
  saksopplysninger: inp.saksopplysninger
    ? {
        ...inp.saksopplysninger,
        kortvarigeArbeidsforhold: (inp.saksopplysninger.kortvarigeArbeidsforhold ?? []).map(arbeidsforhold => ({
          andelsnr: arbeidsforhold.andelsnr ?? 0,
          arbeidsgiverIdent: arbeidsforhold.arbeidsgiverIdent ?? '',
          arbeidsforholdId: arbeidsforhold.arbeidsforholdId,
        })),
        lønnsendringSaksopplysning: inp.saksopplysninger.lønnsendringSaksopplysning?.map(lønnsendring => ({
          ...lønnsendring,
          arbeidsforhold: {
            ...lønnsendring.arbeidsforhold,
            andelsnr: lønnsendring.arbeidsforhold.andelsnr ?? 0,
            arbeidsgiverIdent: lønnsendring.arbeidsforhold.arbeidsgiverIdent ?? '',
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
      aktivitetStatus: forhold.aktivitetStatus,
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
              arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
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
  if (i.inntektAktivitetType === 'YTELSEINNTEKT') {
    return {
      inntektAktivitetType: 'YTELSEINNTEKT',
      beløp: i.beløp ?? 0,
    };
  }
  return {
    inntektAktivitetType: 'FRILANSINNTEKT',
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
  inntekter: (inp.inntekter ?? []).map(inntekt => ({
    ...inntekt,
    beløp: inntekt.beløp ?? 0,
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
