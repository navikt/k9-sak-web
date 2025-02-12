import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { AktivitetStatus } from '@navikt/ft-kodeverk';

import { NyInntektFaktaIndex } from '../NyInntektFaktaIndex';
import { beregningsgrunnlag as bgFlerePerioderMedForlengelse } from '../testdata/FlerePerioderMedForlengelse';
import { beregningsgrunnlag as bgFlerePerioderMedHelg } from '../testdata/FlerePerioderMedHelg';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedForlengelse } from '../testdata/TilkommetAktivitetMedForlengelse';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedForlengelseLukketAP } from '../testdata/TilkommetAktivitetMedForlengelseLukketAP';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedRevurdering } from '../testdata/TilkommetAktivitetRevurderingLøstTidligere';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedRevurdering1MaiSplitt } from '../testdata/TilkommetAktivitetRevurderingLøstTidligere1MaiKryss';
import { beregningsgrunnlag as bgTilkommetAktivitetTrePerioderHelgMellom } from '../testdata/TilkommetAktivitetTrePerioderHelgMellom';
import { type VurderNyttInntektsforholdAP } from './types/interface/VurderNyttInntektsforholdAP';
import { type Vilkår } from './types/Vilkår';

import '@navikt/ds-css';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';

const agOpplysninger = {
  874652202: {
    navn: 'Nav Innlandet',
    identifikator: '874652202',
    erPrivatPerson: false,
  },
  123456789: {
    navn: 'Arbeidsgiveren',
    identifikator: '123456789',
    erPrivatPerson: false,
  },
  123456700: {
    navn: 'Arbeidsgiveren',
    identifikator: '123456700',
    erPrivatPerson: false,
  },
  999999997: {
    navn: 'Arbeidsgiveren',
    identifikator: '999999997',
    erPrivatPerson: false,
  },
  974652293: {
    navn: 'Nav Troms og Finnmark',
    identifikator: '974652293',
    erPrivatPerson: false,
  },
  974239965: {
    navn: 'Nav Trøndelag',
    identifikator: '974239965',
    erPrivatPerson: false,
  },
  999999999: {
    navn: 'Nav Gokk',
    identifikator: '999999999',
    erPrivatPerson: false,
  },
  999999998: {
    navn: 'TESTY TEST',
    identifikator: '999999998',
    erPrivatPerson: true,
    fødselsdato: '2000-01-01',
  },
  910909088: {
    navn: 'BEDRIFT A/S',
    identifikator: '910909088',
    erPrivatPerson: false,
  },
};

const lagVilkår = (perioder: any[]): Vilkår => ({
  vilkarType: 'VK_41',
  overstyrbar: false,
  perioder: perioder.map(p => ({
    periode: { fom: p.fom, tom: p.tom },
    vurderesIBehandlingen: p.vurderesIBehandlingen,
    merknadParametere: {},
    vilkarStatus: 'OPPFYLT',
  })),
});

const meta = {
  title: 'gui/fakta/ny-inntekt',
  component: NyInntektFaktaIndex,
  args: {
    submitCallback: action('button-click', { depth: 20 }) as (data: VurderNyttInntektsforholdAP) => Promise<void>,
    arbeidsgiverOpplysningerPerId: agOpplysninger,
    setFormData: () => undefined,
    submittable: true,
  },
} satisfies Meta<typeof NyInntektFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FlerePerioderMedHelg: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgFlerePerioderMedHelg,
    beregningsgrunnlagVilkår: lagVilkår(
      bgFlerePerioderMedHelg.map(bg => ({
        fom: bg.vilkårsperiodeFom,
        tom: '9999-12-31',
        vurderesIBehandlingen: true,
      })),
    ),
  },
};

export const FlerePerioderMedForlengelse: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgFlerePerioderMedForlengelse,
    beregningsgrunnlagVilkår: lagVilkår(
      bgFlerePerioderMedForlengelse.map(bg => ({
        fom: bg.vilkårsperiodeFom,
        tom: '9999-12-31',
        vurderesIBehandlingen: true,
      })),
    ),
  },
};

export const TilkommetAktivitet: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: [
      {
        avklaringsbehov: [
          {
            definisjon: 'VURDER_NYTT_INNTKTSFRHLD',
            status: 'OPPR',
            kanLoses: true,
          },
        ],
        skjaeringstidspunktBeregning: '2022-11-08',
        aktivitetStatus: ['MIDL_INAKTIV'],
        beregningsgrunnlagPeriode: [
          {
            beregningsgrunnlagPeriodeFom: '2022-11-08',
            beregningsgrunnlagPeriodeTom: '2022-11-08',
            beregnetPrAar: 0,
            bruttoPrAar: 480000,
            bruttoInkludertBortfaltNaturalytelsePrAar: 480000,
            periodeAarsaker: [],
            beregningsgrunnlagPrStatusOgAndel: [
              {
                aktivitetStatus: 'AT',
                andelsnr: 2,
                inntektskategori: '-',
                arbeidsforhold: {
                  arbeidsgiverIdent: '999999997',
                  startdato: '2022-10-27',
                  arbeidsforholdType: 'ARBEID',
                  belopFraInntektsmeldingPrMnd: 40000,
                },
                lagtTilAvSaksbehandler: false,
                erTilkommetAndel: true,
                skalFastsetteGrunnlag: false,
              },
              {
                aktivitetStatus: 'BA',
                beregningsperiodeFom: '2018-01-01',
                beregningsperiodeTom: '2020-12-31',
                beregnetPrAar: 0,
                overstyrtPrAar: 480000,
                bruttoPrAar: 480000,
                andelsnr: 1,
                inntektskategori: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
                lagtTilAvSaksbehandler: false,
                erTilkommetAndel: false,
                skalFastsetteGrunnlag: true,
                pgiSnitt: 0,
                pgiVerdier: [
                  {
                    beløp: 0,
                    årstall: 2020,
                  },
                  {
                    beløp: 0,
                    årstall: 2019,
                  },
                  {
                    beløp: 0,
                    årstall: 2018,
                  },
                ],
                næringer: [],
              },
            ],
          },
          {
            beregningsgrunnlagPeriodeFom: '2022-11-09',
            beregningsgrunnlagPeriodeTom: '9999-12-31',
            beregnetPrAar: 0,
            bruttoPrAar: 480000,
            bruttoInkludertBortfaltNaturalytelsePrAar: 480000,
            periodeAarsaker: ['ENDRING_I_AKTIVITETER_SØKT_FOR'],
            beregningsgrunnlagPrStatusOgAndel: [
              {
                aktivitetStatus: 'BA',
                beregningsperiodeFom: '2018-01-01',
                beregningsperiodeTom: '2020-12-31',
                beregnetPrAar: 0,
                overstyrtPrAar: 480000,
                bruttoPrAar: 480000,
                andelsnr: 1,
                inntektskategori: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
                lagtTilAvSaksbehandler: false,
                erTilkommetAndel: false,
                skalFastsetteGrunnlag: true,
                pgiSnitt: 0,
                pgiVerdier: [
                  {
                    beløp: 0,
                    årstall: 2020,
                  },
                  {
                    beløp: 0,
                    årstall: 2019,
                  },
                  {
                    beløp: 0,
                    årstall: 2018,
                  },
                ],
                næringer: [],
              },
            ],
          },
        ],
        sammenligningsgrunnlagPrStatus: [
          {
            sammenligningsgrunnlagFom: '2022-11-08',
            sammenligningsgrunnlagTom: '2022-12-07',
            rapportertPrAar: 480000,
            avvikPromille: 1000,
            avvikProsent: 100,
            sammenligningsgrunnlagType: 'SAMMENLIGNING_MIDL_INAKTIV',
            differanseBeregnet: -480000,
          },
        ],
        grunnbeløp: 111477,
        faktaOmBeregning: {
          saksopplysninger: {
            lønnsendringSaksopplysning: [],
            kortvarigeArbeidsforhold: [],
          },
          avklarAktiviteter: {
            aktiviteterTomDatoMapping: [
              {
                tom: '2022-11-08',
                aktiviteter: [
                  {
                    arbeidsgiverIdent: '999999997',
                    fom: '2022-10-27',
                    tom: '9999-12-31',
                    arbeidsforholdType: 'ARBEID',
                  },
                ],
              },
            ],
            skjæringstidspunkt: '2022-11-08',
          },
          andelerForFaktaOmBeregning: [
            {
              fastsattBelop: 0,
              inntektskategori: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
              aktivitetStatus: 'BA',
              andelsnr: 1,
              skalKunneEndreAktivitet: false,
              lagtTilAvSaksbehandler: false,
            },
          ],
        },
        faktaOmFordeling: {
          vurderNyttInntektsforholdDto: {
            harMottattOmsorgsstønadEllerFosterhjemsgodtgjørelse: true,
            vurderInntektsforholdPerioder: [
              {
                fom: '2022-11-09',
                tom: '9999-12-31',
                inntektsforholdListe: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: 480000,
                    inntektFraInntektsmeldingPrÅr: 480000,
                    arbeidsforholdId: '123',
                    skalRedusereUtbetaling: false,
                  },
                ],
              },
            ],
          },
          fordelBeregningsgrunnlag: {
            fordelBeregningsgrunnlagPerioder: [
              {
                fom: '2022-11-08',
                tom: '2022-11-08',
                fordelBeregningsgrunnlagAndeler: [
                  {
                    andelsnr: 1,
                    inntektskategori: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
                    aktivitetStatus: 'BA',
                    kilde: 'PROSESS_START',
                    lagtTilAvSaksbehandler: false,
                    andelIArbeid: [100],
                    refusjonskravPrAar: 0,
                    nyttArbeidsforhold: false,
                    arbeidsforholdType: '-',
                  },
                  {
                    andelsnr: 2,
                    arbeidsforhold: {
                      arbeidsgiverIdent: '999999997',
                      startdato: '2022-10-27',
                      arbeidsforholdType: 'ARBEID',
                    },
                    inntektskategori: '-',
                    aktivitetStatus: 'AT',
                    kilde: 'PROSESS_PERIODISERING',
                    lagtTilAvSaksbehandler: false,
                    andelIArbeid: [0],
                    refusjonskravPrAar: 0,
                    belopFraInntektsmeldingPrAar: 480000,
                    nyttArbeidsforhold: true,
                    arbeidsforholdType: 'ARBEID',
                  },
                ],
                skalRedigereInntekt: true,
                skalPreutfyllesMedBeregningsgrunnlag: false,
                skalKunneEndreRefusjon: false,
              },
              {
                fom: '2022-11-09',
                tom: '9999-12-31',
                fordelBeregningsgrunnlagAndeler: [
                  {
                    andelsnr: 1,
                    inntektskategori: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
                    aktivitetStatus: 'BA',
                    kilde: 'PROSESS_START',
                    lagtTilAvSaksbehandler: false,
                    andelIArbeid: [100],
                    refusjonskravPrAar: 0,
                    nyttArbeidsforhold: false,
                    arbeidsforholdType: '-',
                  },
                ],
                skalRedigereInntekt: false,
                skalPreutfyllesMedBeregningsgrunnlag: false,
                skalKunneEndreRefusjon: false,
              },
            ],
            arbeidsforholdTilFordeling: [
              {
                arbeidsgiverIdent: '999999997',
                startdato: '2022-10-27',
                arbeidsforholdType: 'ARBEID',
                perioderMedGraderingEllerRefusjon: [
                  {
                    erRefusjon: false,
                    erGradering: false,
                    erSøktYtelse: true,
                    fom: '2022-11-08',
                    tom: '2022-11-08',
                  },
                ],
              },
            ],
          },
        },
        dekningsgrad: 100,
        ytelsesspesifiktGrunnlag: {
          ytelsetype: 'OMP',
        },
        erOverstyrtInntekt: false,
        vilkårsperiodeFom: '2022-11-08',
      },
    ],
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2022-11-08',
        tom: '2022-11-08',
        vurderesIBehandlingen: true,
      },
    ]),
  },
};

export const TilkommetAktivitetMedForlengelse: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgTilkommetInntektsforholdMedForlengelse,
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2022-11-08',
        tom: '2022-11-20',
        vurderesIBehandlingen: true,
        erForlengelse: true,
      },
    ]),
  },
};

export const TilkommetAktivitetMedForlengelseLukketAP: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgTilkommetInntektsforholdMedForlengelseLukketAP,
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2022-11-08',
        tom: '2022-11-20',
        vurderesIBehandlingen: true,
        erForlengelse: true,
      },
    ]),
  },
};

export const TilkommetAktivitetMedRevurdering: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgTilkommetInntektsforholdMedRevurdering,
    submitCallback: action('button-click', { depth: 20 }) as (data: any) => Promise<any>,
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2022-11-08',
        tom: '2022-11-20',
        vurderesIBehandlingen: true,
        erForlengelse: false,
      },
    ]),
  },
};

export const TilkommetAktivitetMedRevurdering1MaiKryss: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgTilkommetInntektsforholdMedRevurdering1MaiSplitt,
    submitCallback: action('button-click', { depth: 20 }) as (data: any) => Promise<any>,
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2023-04-25',
        tom: '2023-05-20',
        vurderesIBehandlingen: true,
        erForlengelse: false,
      },
    ]),
  },
};

export const TilkommetAktiviteTreLikePerioderHelgMellomAlle: Story = {
  args: {
    readOnly: false,
    beregningsgrunnlagListe: bgTilkommetAktivitetTrePerioderHelgMellom,
    submitCallback: action('button-click', { depth: 20 }) as (data: any) => Promise<any>,
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2023-04-10',
        tom: '2023-04-28',
        vurderesIBehandlingen: true,
        erForlengelse: false,
      },
    ]),
  },
};
