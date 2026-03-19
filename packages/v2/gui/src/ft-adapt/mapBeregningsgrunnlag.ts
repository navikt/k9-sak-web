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

const mapPgiDto = (pgi: PgiDto): FPPgiVerdier => {
  if (pgi.beløp != null && pgi.årstall != null) {
    return {
      beløp: pgi.beløp,
      årstall: pgi.årstall,
    };
  }
  throw new Error(`PgiDto beløp og årstall må vere definert`);
};

const mapNæringer = (næring: EgenNæringDto): FPNæring => {
  return {
    ...næring,
    orgnr: næring.orgnr ?? '',
    virksomhetType: næring.virksomhetType ?? VirksomhetType.UDEFINERT,
  };
};

const mapBeregningsgrunnlagPrStatusOgAndelTilFP = (
  andel: BeregningsgrunnlagPrStatusOgAndelDto,
): FPBeregningsgrunnlagAndel => {
  if (andel.andelsnr == null) {
    throw new Error('BeregningsgrunnlagPrStatusOgAndelDto.andelsnr skal aldri vere null');
  }
  return {
    ...andel,
    arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
    andelsnr: andel.andelsnr,
    pgiVerdier: andel.dtoType === 'SN' ? andel.pgiVerdier?.map(mapPgiDto) : undefined,
    næringer: andel.dtoType === 'SN' ? andel.næringer?.map(mapNæringer) : undefined,
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
  sammenligningsgrunnlag: NonNullable<BeregningsgrunnlagDto['sammenligningsgrunnlagPrStatus']>[number],
): FPSammenligningsgrunnlag => {
  if (!sammenligningsgrunnlag.sammenligningsgrunnlagType) {
    throw new Error('sammenligningsgrunnlagType må være definert');
  }
  return {
    sammenligningsgrunnlagType: sammenligningsgrunnlag.sammenligningsgrunnlagType,
    differanseBeregnet: sammenligningsgrunnlag.differanseBeregnet ?? 0,
    avvikProsent: sammenligningsgrunnlag.avvikProsent ?? 0,
    avvikPromille: sammenligningsgrunnlag.avvikPromille ?? 0,
    rapportertPrAar: sammenligningsgrunnlag.rapportertPrAar ?? 0,
    sammenligningsgrunnlagFom: sammenligningsgrunnlag.sammenligningsgrunnlagFom ?? '',
    sammenligningsgrunnlagTom: sammenligningsgrunnlag.sammenligningsgrunnlagTom ?? '',
  };
};

const mapFaktaOmBeregning = (faktaOmBeregning: FaktaOmBeregningDto): FPFaktaOmBeregning => ({
  ...faktaOmBeregning,
  andelerForFaktaOmBeregning: (faktaOmBeregning.andelerForFaktaOmBeregning ?? []).map(andel => ({
    ...andel,
    aktivitetStatus: andel.aktivitetStatus ?? '-',
    lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
  })),
  frilansAndel:
    faktaOmBeregning.frilansAndel != null
      ? {
          ...faktaOmBeregning.frilansAndel,
          arbeidsforhold: mapOptionalArbeidsforhold(faktaOmBeregning.frilansAndel.arbeidsforhold),
        }
      : undefined,
  arbeidsforholdMedLønnsendringUtenIM: faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM?.map(arbeidsforhold => ({
    ...arbeidsforhold,
    arbeidsforhold: mapOptionalArbeidsforhold(arbeidsforhold.arbeidsforhold),
  })),
  kortvarigeArbeidsforhold: faktaOmBeregning.kortvarigeArbeidsforhold?.map(arbeidsforhold => ({
    ...arbeidsforhold,
    aktivitetStatus: arbeidsforhold.aktivitetStatus ?? '-',
    lagtTilAvSaksbehandler: arbeidsforhold.lagtTilAvSaksbehandler ?? false,
    arbeidsforhold: mapOptionalArbeidsforhold(arbeidsforhold.arbeidsforhold),
  })),
  kunYtelse:
    faktaOmBeregning.kunYtelse != null
      ? {
          ...faktaOmBeregning.kunYtelse,
          fodendeKvinneMedDP: faktaOmBeregning.kunYtelse.fodendeKvinneMedDP ?? false,
          andeler: faktaOmBeregning.kunYtelse.andeler?.map(andel => ({
            ...andel,
            fastsattBelopPrMnd: andel.fastsattBelopPrMnd ?? null,
            arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
          })),
        }
      : undefined,
  vurderMottarYtelse:
    faktaOmBeregning.vurderMottarYtelse != null
      ? {
          ...faktaOmBeregning.vurderMottarYtelse,
          arbeidstakerAndelerUtenIM: faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM?.map(andel => ({
            ...andel,
            lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler ?? false,
            arbeidsforhold: mapOptionalArbeidsforhold(andel.arbeidsforhold),
          })),
        }
      : undefined,
  arbeidstakerOgFrilanserISammeOrganisasjonListe: faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe?.map(
    arbeidstakerOgFrilanser => ({
      ...arbeidstakerOgFrilanser,
      arbeidsforhold: mapOptionalArbeidsforhold(arbeidstakerOgFrilanser.arbeidsforhold),
    }),
  ),
  saksopplysninger: faktaOmBeregning.saksopplysninger
    ? {
        ...faktaOmBeregning.saksopplysninger,
        kortvarigeArbeidsforhold: (faktaOmBeregning.saksopplysninger.kortvarigeArbeidsforhold ?? []).map(
          arbeidsforhold => ({
            andelsnr: arbeidsforhold.andelsnr ?? 0,
            arbeidsgiverIdent: arbeidsforhold.arbeidsgiverIdent ?? '',
            arbeidsforholdId: arbeidsforhold.arbeidsforholdId,
          }),
        ),
        lønnsendringSaksopplysning: faktaOmBeregning.saksopplysninger.lønnsendringSaksopplysning?.map(lønnsendring => ({
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
  vurderNyttInntektsforhold: NonNullable<FordelingDto['vurderNyttInntektsforholdDto']>,
): NonNullable<FPFaktaOmFordeling['vurderNyttInntektsforholdDto']> => ({
  ...vurderNyttInntektsforhold,
  vurderInntektsforholdPerioder: vurderNyttInntektsforhold.vurderInntektsforholdPerioder?.map(periode => ({
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

const mapFaktaOmFordeling = (fordeling: FordelingDto): FPFaktaOmFordeling => ({
  fordelBeregningsgrunnlag: fordeling.fordelBeregningsgrunnlag
    ? {
        ...fordeling.fordelBeregningsgrunnlag,
        fordelBeregningsgrunnlagPerioder: fordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder?.map(
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
    fordeling.vurderNyttInntektsforholdDto != null
      ? mapVurderNyttInntektsforholdDto(fordeling.vurderNyttInntektsforholdDto)
      : undefined,
});

const mapRefusjonAndel = (andel: RefusjonTilVurderingDto['andeler'][number]): FPRefusjonTilVurderingAndel => ({
  ...andel,
  nyttRefusjonskravFom: andel.nyttRefusjonskravFom ?? '',
  tidligsteMuligeRefusjonsdato: andel.tidligsteMuligeRefusjonsdato ?? '',
  skalKunneFastsetteDelvisRefusjon: andel.skalKunneFastsetteDelvisRefusjon ?? false,
});

const mapRefusjonTilVurdering = (
  refusjonTilVurdering: RefusjonTilVurderingDto,
): NonNullable<FPBeregningsgrunnlag['refusjonTilVurdering']> => ({
  andeler: refusjonTilVurdering.andeler.map(mapRefusjonAndel),
});

const mapInntektsgrunnlagInntekt = (
  inntekt: NonNullable<InntektsgrunnlagDto['beregningsgrunnlagInntekter'][number]['inntekter']>[number],
): FPInntektsgrunnlag['beregningsgrunnlagInntekter'][number]['inntekter'][number] => {
  if (inntekt.inntektAktivitetType === 'ARBEIDSTAKERINNTEKT') {
    return {
      inntektAktivitetType: 'ARBEIDSTAKERINNTEKT',
      arbeidsgiverIdent: inntekt.arbeidsgiverIdent ?? '',
      beløp: inntekt.beløp ?? 0,
    };
  }
  if (inntekt.inntektAktivitetType === 'YTELSEINNTEKT') {
    return {
      inntektAktivitetType: 'YTELSEINNTEKT',
      beløp: inntekt.beløp ?? 0,
    };
  }
  return {
    inntektAktivitetType: 'FRILANSINNTEKT',
    beløp: inntekt.beløp ?? 0,
  };
};

const mapInntektsgrunnlagMåned = (
  måned: InntektsgrunnlagDto['beregningsgrunnlagInntekter'][number],
): FPInntektsgrunnlag['beregningsgrunnlagInntekter'][number] => ({
  ...måned,
  inntekter: (måned.inntekter ?? []).map(mapInntektsgrunnlagInntekt),
});

const mapPgiGrunnlag = (
  pgiGrunnlag: InntektsgrunnlagDto['pgiGrunnlag'][number],
): FPInntektsgrunnlag['pgiGrunnlag'][number] => ({
  ...pgiGrunnlag,
  inntekter: (pgiGrunnlag.inntekter ?? []).map(inntekt => ({
    ...inntekt,
    beløp: inntekt.beløp ?? 0,
  })),
});

const mapInntektsgrunnlag = (inntektsgrunnlag: InntektsgrunnlagDto): FPInntektsgrunnlag => ({
  beregningsgrunnlagInntekter: inntektsgrunnlag.beregningsgrunnlagInntekter.map(mapInntektsgrunnlagMåned),
  sammenligningsgrunnlagInntekter: inntektsgrunnlag.sammenligningsgrunnlagInntekter.map(mapInntektsgrunnlagMåned),
  pgiGrunnlag: inntektsgrunnlag.pgiGrunnlag.map(mapPgiGrunnlag),
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
