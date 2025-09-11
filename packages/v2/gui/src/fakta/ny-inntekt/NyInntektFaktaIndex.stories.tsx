import type { Meta, StoryObj } from '@storybook/react';
import AktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import OpptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';

import { NyInntektFaktaIndex } from './NyInntektFaktaIndex';
import { type Vilkår } from './src/types/Vilkår';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedForlengelse } from './testdata/TilkommetAktivitetMedForlengelse';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedForlengelseLukketAP } from './testdata/TilkommetAktivitetMedForlengelseLukketAP';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedRevurdering } from './testdata/TilkommetAktivitetRevurderingLøstTidligere';
import { beregningsgrunnlag as bgTilkommetInntektsforholdMedRevurdering1MaiSplitt } from './testdata/TilkommetAktivitetRevurderingLøstTidligere1MaiKryss';
import { beregningsgrunnlag as bgTilkommetAktivitetTrePerioderHelgMellom } from './testdata/TilkommetAktivitetTrePerioderHelgMellom';

import { asyncAction } from '@k9-sak-web/gui/storybook/asyncAction.js';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

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
    submitCallback: asyncAction('Løs aksjonspunkt'),
    arbeidsgiverOpplysningerPerId: agOpplysninger,
    setFormData: () => undefined,
    submittable: true,
  },
} satisfies Meta<typeof NyInntektFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

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
                aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                andelsnr: 2,
                inntektskategori: '-',
                arbeidsforhold: {
                  arbeidsgiverIdent: '999999997',
                  startdato: '2022-10-27',
                  arbeidsforholdType: OpptjeningAktivitetType.ARBEID,
                  belopFraInntektsmeldingPrMnd: 40000,
                },
                lagtTilAvSaksbehandler: false,
                erTilkommetAndel: true,
                skalFastsetteGrunnlag: false,
              },
              {
                aktivitetStatus: AktivitetStatus.BRUKERS_ANDEL,
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
                aktivitetStatus: AktivitetStatus.BRUKERS_ANDEL,
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
                    arbeidsforholdType: OpptjeningAktivitetType.ARBEID,
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
              aktivitetStatus: AktivitetStatus.BRUKERS_ANDEL,
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
                    aktivitetStatus: AktivitetStatus.BRUKERS_ANDEL,
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
                      arbeidsforholdType: OpptjeningAktivitetType.ARBEID,
                    },
                    inntektskategori: '-',
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    kilde: 'PROSESS_PERIODISERING',
                    lagtTilAvSaksbehandler: false,
                    andelIArbeid: [0],
                    refusjonskravPrAar: 0,
                    belopFraInntektsmeldingPrAar: 480000,
                    nyttArbeidsforhold: true,
                    arbeidsforholdType: OpptjeningAktivitetType.ARBEID,
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
                    aktivitetStatus: AktivitetStatus.BRUKERS_ANDEL,
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
                arbeidsforholdType: OpptjeningAktivitetType.ARBEID,
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
    submitCallback: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('skal kunne løse aksjonspunkt for tilkommet aktivitet', async () => {
      await expect(canvas.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();
      await expect(
        await canvas.findByText(
          'Har søker inntekt fra Arbeidsgiveren (999999997)...123 som kan medføre gradering mot inntekt?',
        ),
      ).toBeInTheDocument();
      await expect(canvas.getByText('Årsinntekt')).toBeInTheDocument();
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'En saklig begrunnelse');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback).toHaveBeenCalledWith({
        begrunnelse: 'En saklig begrunnelse',
        grunnlag: [
          {
            periode: {
              fom: '2022-11-08',
              tom: '2022-11-08',
            },
            begrunnelse: 'En saklig begrunnelse',
            tilkomneInntektsforhold: [
              {
                fom: '2022-11-09',
                tom: '9999-12-31',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: 480000,
                    skalRedusereUtbetaling: true,
                  },
                ],
              },
            ],
          },
        ],
        kode: 'VURDER_NYTT_INNTKTSFRHLD',
      });
    });
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
    submitCallback: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('skal kunne løse aksjonspunkt for tilkommet aktivitet med forlengelse', async () => {
      await expect(canvas.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();

      await expect(await canvas.findByText('09.11.2022 - 13.11.2022')).toBeInTheDocument();
      await userEvent.click(canvas.getByText('09.11.2022 - 13.11.2022'));

      await expect(canvas.getAllByText('Årsinntekt')).toHaveLength(2);
      await expect(canvas.getAllByText('450 000 kr')).toHaveLength(3);

      await expect(canvas.getAllByText('Reduserer inntektstap')).toHaveLength(2);

      await expect(canvas.getAllByText('Arbeidsgiveren (999999997)...123')).toHaveLength(3);
      await expect(canvas.getAllByText('Nei')).toHaveLength(4);

      await expect(canvas.getAllByText('Nav Troms og Finnmark (974652293)...456')).toHaveLength(2);
      await expect(canvas.getAllByText('Ja')).toHaveLength(3);

      await expect(canvas.getByText('300 000 kr')).toBeInTheDocument();
      await expect(canvas.getByText('16.11.2022 - 20.11.2022')).toBeInTheDocument();
      await expect(
        canvas.getByText(
          'Har søker inntekt fra Arbeidsgiveren (999999997)...123 som kan medføre gradering mot inntekt?',
        ),
      ).toBeInTheDocument();
      const neiLabels = canvas.getAllByLabelText('Nei');
      if (neiLabels[0]) {
        await userEvent.click(neiLabels[0]);
      }

      await expect(
        canvas.getByText(
          'Har søker inntekt fra Nav Troms og Finnmark (974652293)...456 som kan medføre gradering mot inntekt?',
        ),
      ).toBeInTheDocument();

      const jaLabels = canvas.getAllByLabelText('Ja');
      if (jaLabels[1]) {
        await userEvent.click(jaLabels[1]);
      }
      await expect(canvas.getByLabelText('Fastsett årsinntekt')).toBeInTheDocument();

      await userEvent.type(canvas.getByLabelText('Fastsett årsinntekt'), '1349');
      await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'En saklig begrunnelse');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback).toHaveBeenCalledWith({
        begrunnelse: 'En saklig begrunnelse',
        grunnlag: [
          {
            periode: {
              fom: '2022-11-08',
              tom: '2022-11-20',
            },
            begrunnelse: 'En saklig begrunnelse',
            tilkomneInntektsforhold: [
              {
                fom: '2022-11-16',
                tom: '2022-11-20',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: undefined,
                    skalRedusereUtbetaling: false,
                  },
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '456',
                    arbeidsgiverId: '974652293',
                    bruttoInntektPrÅr: 1349,
                    skalRedusereUtbetaling: true,
                  },
                ],
              },
            ],
          },
        ],
        kode: 'VURDER_NYTT_INNTKTSFRHLD',
      });
    });
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
    submitCallback: asyncAction('Løs aksjonspunkt'),
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
    submitCallback: asyncAction('Løs aksjonspunkt'),
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
    submitCallback: fn(),
    beregningsgrunnlagVilkår: lagVilkår([
      {
        fom: '2023-04-10',
        tom: '2023-04-28',
        vurderesIBehandlingen: true,
        erForlengelse: false,
      },
    ]),
  },
  play: async ({ args, canvas, step }) => {
    await step('skal kunne løse aksjonspunkt for tilkommet i revurdering og legge til nye perioder', async () => {
      await expect(canvas.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();
      await expect(await canvas.findByText('10.04.2023 - 21.04.2023')).toBeInTheDocument();
      await expect(canvas.getByText('Del opp periode')).toBeInTheDocument();

      await userEvent.click(canvas.getByText('Del opp periode'));
      await expect(canvas.getByText('Hvilken periode ønsker du å dele opp?')).toBeInTheDocument();
      await expect(canvas.getAllByText('Del opp periode')[2]?.closest('button')).toBeDisabled();

      await expect(await canvas.queryByText('Opprett ny vurdering fra')).not.toBeInTheDocument();
      await userEvent.selectOptions(
        canvas.getByLabelText('Hvilken periode ønsker du å dele opp?'),
        '10.04.2023 - 21.04.2023',
      );
      await expect(canvas.getAllByText('Del opp periode')[2]?.closest('button')).toBeDisabled();
      await expect(canvas.getByText('Opprett ny vurdering fra')).toBeInTheDocument();

      await userEvent.click(canvas.getByLabelText('Åpne datovelger'));
      await userEvent.click(canvas.getByText('18'));
      await expect(await canvas.getAllByText('Del opp periode')[2]?.closest('button')).toBeEnabled();
      await expect(canvas.getByText('Nye perioder til vurdering:')).toBeInTheDocument();
      await expect(canvas.getByText('10.04.2023 - 17.04.2023')).toBeInTheDocument();
      await expect(canvas.getByText('18.04.2023 - 21.04.2023')).toBeInTheDocument();
      const delOppPeriodeButtons = canvas.getAllByRole('button', { name: 'Del opp periode' });
      if (delOppPeriodeButtons[1]) {
        await userEvent.click(delOppPeriodeButtons[1]);
      }
      await expect(await canvas.findByText('10.04.2023 - 17.04.2023')).toBeInTheDocument();
      await expect(canvas.getByText('18.04.2023 - 21.04.2023')).toBeInTheDocument();

      await expect(canvas.getAllByText('Ja')).toHaveLength(4);
      await expect(canvas.getAllByText('Nei')).toHaveLength(4);

      const neiLabels = canvas.getAllByLabelText('Nei');
      // 10.04.2023 - 17.04.2023
      if (neiLabels[0]) {
        await userEvent.click(neiLabels[0]);
      }

      const jaLabels = canvas.getAllByLabelText('Ja');
      // 18.04.2023 - 21.04.2023 og 24.04.2023 - 28.04.2023
      if (jaLabels[1] && jaLabels[2] && jaLabels[3]) {
        await userEvent.click(jaLabels[1]);
        await userEvent.click(jaLabels[2]);
        await userEvent.click(jaLabels[3]);
      }
      const fastsettAarsinntektElements = canvas.getAllByLabelText('Fastsett årsinntekt');
      await expect(fastsettAarsinntektElements).toHaveLength(3);

      if (fastsettAarsinntektElements[0]) {
        await userEvent.type(fastsettAarsinntektElements[0], '200000');
      }
      if (fastsettAarsinntektElements[1]) {
        await userEvent.type(fastsettAarsinntektElements[1], '200000');
      }
      if (fastsettAarsinntektElements[2]) {
        await userEvent.clear(fastsettAarsinntektElements[2]);
        await userEvent.type(fastsettAarsinntektElements[2], '350000');
      }

      // Begrunnelse og submit
      await userEvent.type(canvas.getByLabelText('Begrunnelse for alle perioder'), 'En saklig begrunnelse');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback).toHaveBeenCalledWith({
        begrunnelse: 'En saklig begrunnelse',
        grunnlag: [
          {
            periode: {
              fom: '2023-04-10',
              tom: '2023-04-28',
            },
            begrunnelse: 'En saklig begrunnelse',
            tilkomneInntektsforhold: [
              {
                fom: '2023-04-10',
                tom: '2023-04-14',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: undefined,
                    skalRedusereUtbetaling: false,
                  },
                ],
              },
              {
                fom: '2023-04-17',
                tom: '2023-04-17',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: undefined,
                    skalRedusereUtbetaling: false,
                  },
                ],
              },
              {
                fom: '2023-04-18',
                tom: '2023-04-21',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: 200000,
                    skalRedusereUtbetaling: true,
                  },
                ],
              },
              {
                fom: '2023-04-24',
                tom: '2023-04-28',
                tilkomneInntektsforhold: [
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '123',
                    arbeidsgiverId: '999999997',
                    bruttoInntektPrÅr: 200000,
                    skalRedusereUtbetaling: true,
                  },
                  {
                    aktivitetStatus: AktivitetStatus.ARBEIDSTAKER,
                    arbeidsforholdId: '456',
                    arbeidsgiverId: '974652293',
                    bruttoInntektPrÅr: 350000,
                    skalRedusereUtbetaling: true,
                  },
                ],
              },
            ],
          },
        ],
        kode: 'VURDER_NYTT_INNTKTSFRHLD',
      });
    });
  },
};
