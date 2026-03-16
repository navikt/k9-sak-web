import { folketrygdloven_kalkulus_kodeverk_LønnsendringScenario } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { describe, expect, it } from 'vitest';
import { mapBeregningsgrunnlagTilFP } from './mapBeregningsgrunnlag.js';

const minimalBg = {
  grunnbeløp: 118620,
  skjaeringstidspunktBeregning: '2024-01-01',
  erOverstyrtInntekt: false,
  avklaringsbehov: [],
  beregningsgrunnlagPeriode: [],
  skjæringstidspunkt: '2024-01-01',
};

describe('mapBeregningsgrunnlagTilFP', () => {
  it('kaster feil dersom grunnbeløp er null', () => {
    expect(() => mapBeregningsgrunnlagTilFP({ ...minimalBg, grunnbeløp: undefined })).toThrow();
  });

  it('mapper minimalt grunnlag uten feil', () => {
    const result = mapBeregningsgrunnlagTilFP(minimalBg);
    expect(result.grunnbeløp).toBe(118620);
    expect(result.erOverstyrtInntekt).toBe(false);
  });

  it('bruker tom streng som fallback for vilkårsperiodeFom', () => {
    const result = mapBeregningsgrunnlagTilFP({ ...minimalBg, vilkårsperiodeFom: undefined });
    expect(result.vilkårsperiodeFom).toBe('');
  });

  it('videresender vilkårsperiodeFom når den er satt', () => {
    const result = mapBeregningsgrunnlagTilFP({ ...minimalBg, vilkårsperiodeFom: '2024-01-01' });
    expect(result.vilkårsperiodeFom).toBe('2024-01-01');
  });
});

describe('mapBeregningsgrunnlagTilFP – sammenligningsgrunnlag', () => {
  it('kaster feil dersom sammenligningsgrunnlagType mangler', () => {
    expect(() =>
      mapBeregningsgrunnlagTilFP({
        ...minimalBg,
        sammenligningsgrunnlagPrStatus: [{}],
      }),
    ).toThrow('sammenligningsgrunnlagType må være definert');
  });

  it('mapper sammenligningsgrunnlag med fallbacks for alle valgfrie felt', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      sammenligningsgrunnlagPrStatus: [{ sammenligningsgrunnlagType: 'SAMMENLIGNING_AT' }],
    });
    const sg = result.sammenligningsgrunnlagPrStatus![0]!;
    expect(sg.sammenligningsgrunnlagType).toBe('SAMMENLIGNING_AT');
    expect(sg.differanseBeregnet).toBe(0);
    expect(sg.avvikProsent).toBe(0);
    expect(sg.avvikPromille).toBe(0);
    expect(sg.rapportertPrAar).toBe(0);
    expect(sg.sammenligningsgrunnlagFom).toBe('');
    expect(sg.sammenligningsgrunnlagTom).toBe('');
  });

  it('videresender sammenligningsgrunnlag-verdier når de er satt', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      sammenligningsgrunnlagPrStatus: [
        {
          sammenligningsgrunnlagType: 'SAMMENLIGNING_AT',
          differanseBeregnet: 100,
          avvikProsent: 25,
          avvikPromille: 250,
          rapportertPrAar: 400000,
          sammenligningsgrunnlagFom: '2023-01-01',
          sammenligningsgrunnlagTom: '2023-12-31',
        },
      ],
    });
    const sg = result.sammenligningsgrunnlagPrStatus![0]!;
    expect(sg.sammenligningsgrunnlagType).toBe('SAMMENLIGNING_AT');
    expect(sg.differanseBeregnet).toBe(100);
    expect(sg.rapportertPrAar).toBe(400000);
  });
});

describe('mapBeregningsgrunnlagTilFP – faktaOmBeregning', () => {
  it('bruker tom array som fallback for andelerForFaktaOmBeregning', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {},
    });
    expect(result.faktaOmBeregning!.andelerForFaktaOmBeregning).toEqual([]);
  });

  it('mapper andel med fallbacks for aktivitetStatus og lagtTilAvSaksbehandler', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {
        andelerForFaktaOmBeregning: [{ aktivitetStatus: undefined, lagtTilAvSaksbehandler: undefined }],
      },
    });
    const andel = result.faktaOmBeregning!.andelerForFaktaOmBeregning[0]!;
    expect(andel.aktivitetStatus).toBe('-');
    expect(andel.lagtTilAvSaksbehandler).toBe(false);
  });

  it('mapper arbeidsforholdType i andel med fallback til bindestreks', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {
        andelerForFaktaOmBeregning: [
          {
            aktivitetStatus: 'AT',
            lagtTilAvSaksbehandler: false,
            arbeidsforhold: { arbeidsforholdType: undefined },
          },
        ],
      },
    });
    const andel = result.faktaOmBeregning!.andelerForFaktaOmBeregning[0]!;
    expect(andel.arbeidsforhold!.arbeidsforholdType).toBe('-');
  });

  it('mapper saksopplysninger.kortvarigeArbeidsforhold med fallbacks', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {
        saksopplysninger: {
          kortvarigeArbeidsforhold: [{ andelsnr: undefined, arbeidsgiverIdent: undefined }],
        },
      },
    });
    const kvaf = result.faktaOmBeregning!.saksopplysninger!.kortvarigeArbeidsforhold[0]!;
    expect(kvaf.andelsnr).toBe(0);
    expect(kvaf.arbeidsgiverIdent).toBe('');
  });

  it('mapper saksopplysninger.lønnsendringSaksopplysning med fallbacks', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {
        saksopplysninger: {
          kortvarigeArbeidsforhold: [],
          lønnsendringSaksopplysning: [
            {
              sisteLønnsendringsdato: '2024-01-01',
              lønnsendringscenario: folketrygdloven_kalkulus_kodeverk_LønnsendringScenario.FULL_MÅNEDSINNTEKT_EN_MND,
              arbeidsforhold: { andelsnr: undefined, arbeidsgiverIdent: undefined },
            },
          ],
        },
      },
    });
    const l = result.faktaOmBeregning!.saksopplysninger!.lønnsendringSaksopplysning![0]!;
    expect(l.arbeidsforhold.andelsnr).toBe(0);
    expect(l.arbeidsforhold.arbeidsgiverIdent).toBe('');
  });

  it('mapper kunYtelse med fallbacks', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmBeregning: {
        kunYtelse: {
          fodendeKvinneMedDP: undefined,
          andeler: [
            {
              fastsattBelopPrMnd: undefined,
              aktivitetStatus: 'KUN_YTELSE',
              andelIArbeid: [],
              andelsnr: 0,
              inntektskategori: 'ARBEIDSAVKLARINGSPENGER',
              kilde: 'SAKSBEHANDLER_KOFAKBER',
            },
          ],
        },
      },
    });
    const ky = result.faktaOmBeregning!.kunYtelse!;
    expect(ky.fodendeKvinneMedDP).toBe(false);
    expect(ky.andeler![0]!.fastsattBelopPrMnd).toBeNull();
  });
});

describe('mapBeregningsgrunnlagTilFP – faktaOmFordeling', () => {
  it('mapper arbeidsforholdType i fordelAndel', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      faktaOmFordeling: {
        fordelBeregningsgrunnlag: {
          arbeidsforholdTilFordeling: [],
          fordelBeregningsgrunnlagPerioder: [
            {
              fom: '2024-01-01',
              fordelBeregningsgrunnlagAndeler: [
                {
                  arbeidsforhold: { arbeidsforholdType: undefined },
                  aktivitetStatus: 'KUN_YTELSE',
                  andelIArbeid: [],
                  andelsnr: 0,
                  arbeidsforholdType: 'DAGPENGER',
                  inntektskategori: 'ARBEIDSAVKLARINGSPENGER',
                  kilde: 'SAKSBEHANDLER_KOFAKBER',
                },
              ],
            },
          ],
        },
      },
    });
    const andel =
      result.faktaOmFordeling!.fordelBeregningsgrunnlag!.fordelBeregningsgrunnlagPerioder![0]!
        .fordelBeregningsgrunnlagAndeler![0]!;
    expect(andel.arbeidsforhold!.arbeidsforholdType).toBe('-');
  });
});

describe('mapBeregningsgrunnlagTilFP – refusjonTilVurdering', () => {
  it('mapper refusjonsandel med fallbacks for påkrevde felt', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      refusjonTilVurdering: {
        refusjonskravForSentListe: [],
        andeler: [
          {
            aktivitetStatus: 'AT',
            nyttRefusjonskravFom: undefined,
            tidligsteMuligeRefusjonsdato: undefined,
            skalKunneFastsetteDelvisRefusjon: undefined,
          },
        ],
      },
    });
    const andel = result.refusjonTilVurdering!.andeler[0]!;
    expect(andel.nyttRefusjonskravFom).toBe('');
    expect(andel.tidligsteMuligeRefusjonsdato).toBe('');
    expect(andel.skalKunneFastsetteDelvisRefusjon).toBe(false);
  });
});

describe('mapBeregningsgrunnlagTilFP – inntektsgrunnlag', () => {
  it('bruker tom array som fallback for inntekter i måned', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      inntektsgrunnlag: {
        beregningsgrunnlagInntekter: [{ fom: '2024-01-01', tom: '2024-01-31', inntekter: undefined }],
        sammenligningsgrunnlagInntekter: [],
        pgiGrunnlag: [],
        måneder: [],
      },
    });
    expect(result.inntektsgrunnlag!.beregningsgrunnlagInntekter[0]!.inntekter).toEqual([]);
  });

  it('mapper ARBEIDSTAKERINNTEKT med arbeidsgiverIdent fallback', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      inntektsgrunnlag: {
        beregningsgrunnlagInntekter: [
          {
            fom: '2024-01-01',
            tom: '2024-01-31',
            inntekter: [{ inntektAktivitetType: 'ARBEIDSTAKERINNTEKT', beløp: 50000, arbeidsgiverIdent: undefined }],
          },
        ],
        sammenligningsgrunnlagInntekter: [],
        pgiGrunnlag: [],
        måneder: [],
      },
    });
    const inntekt = result.inntektsgrunnlag!.beregningsgrunnlagInntekter[0]!.inntekter[0]!;
    expect(inntekt.inntektAktivitetType).toBe('ARBEIDSTAKERINNTEKT');
    if (inntekt.inntektAktivitetType === 'ARBEIDSTAKERINNTEKT') {
      expect(inntekt.arbeidsgiverIdent).toBe('');
    }
  });

  it('mapper FRILANSINNTEKT uten arbeidsgiverIdent', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      inntektsgrunnlag: {
        beregningsgrunnlagInntekter: [
          {
            fom: '2024-01-01',
            tom: '2024-01-31',
            inntekter: [{ inntektAktivitetType: 'FRILANSINNTEKT', beløp: undefined }],
          },
        ],
        sammenligningsgrunnlagInntekter: [],
        pgiGrunnlag: [],
        måneder: [],
      },
    });
    const inntekt = result.inntektsgrunnlag!.beregningsgrunnlagInntekter[0]!.inntekter[0]!;
    expect(inntekt.inntektAktivitetType).toBe('FRILANSINNTEKT');
    expect(inntekt.beløp).toBe(0);
  });

  it('mapper pgiGrunnlag med beløp-fallback', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      inntektsgrunnlag: {
        beregningsgrunnlagInntekter: [],
        sammenligningsgrunnlagInntekter: [],
        pgiGrunnlag: [{ år: 2023, inntekter: [{ pgiType: 'LØNN', beløp: undefined }] }],
        måneder: [],
      },
    });
    expect(result.inntektsgrunnlag!.pgiGrunnlag[0]!.inntekter[0]!.beløp).toBe(0);
  });

  it('bruker tom array som fallback for pgiGrunnlag.inntekter', () => {
    const result = mapBeregningsgrunnlagTilFP({
      ...minimalBg,
      inntektsgrunnlag: {
        beregningsgrunnlagInntekter: [],
        sammenligningsgrunnlagInntekter: [],
        pgiGrunnlag: [{ år: 2023, inntekter: undefined }],
        måneder: [],
      },
    });
    expect(result.inntektsgrunnlag!.pgiGrunnlag[0]!.inntekter).toEqual([]);
  });
});
