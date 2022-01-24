import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';
import arbeidsgivere from '../mocks/arbeidsgivere.json';

const standardFom = '2019-09-16';
const standardTom = undefined;

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
};
const lagPGIVerdier = () => [
  {
    beløp: 124412,
    årstall: 2017,
  },
  {
    beløp: 98456,
    årstall: 2016,
  },
  {
    beløp: 9861482,
    årstall: 2015,
  },
];
const lagAPMedKode = kode => [
  {
    definisjon: {
      kode,
    },
    status: {
      kode: 'OPPR',
    },
    begrunnelse: null,
    endretAv: 'B123456',
    endretTidspunkt: '2020-01-20',
  },
];

const vilkarMedUtfall = (kode, fomArray) => [
  {
    vilkarType: {
      kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
      kodeverk: 'vilkarType',
    },
    perioder: fomArray.map(fom => ({
      periode: { fom, tom: null},
      vilkarStatus: {
        kode,
        kodeverk: 'vilkarStatus',
      },
      vurdersIBehandlingen: true
    })),
  },
];

const lagArbeidsforhold = (
  arbeidsgiverId,
  arbeidsforholdId,
  eksternArbeidsforholdId,
  opphoersdato,
  stillingsNavn,
  stillingsProsent,
) => ({
  arbeidsgiverId,
  startdato: '2018-10-09',
  opphoersdato,
  arbeidsforholdId,
  eksternArbeidsforholdId,
  arbeidsforholdType: {
    kode: 'ARBEID',
    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
  },
  aktørId: null,
  refusjonPrAar: 360000,
  belopFraInntektsmeldingPrMnd: 30000,
  organisasjonstype: {
    kode: 'VIRKSOMHET',
    kodeverk: 'ORGANISASJONSTYPE',
  },
  naturalytelseBortfaltPrÅr: null,
  naturalytelseTilkommetPrÅr: null,
  stillingsNavn,
  stillingsProsent,
});

const lagAndel = (
  aktivitetstatuskode,
  beregnetPrAar,
  overstyrtPrAar,
  erTidsbegrensetArbeidsforhold,
  skalFastsetteGrunnlag,
) => ({
  beregningsgrunnlagTom: '2019-08-31',
  beregningsgrunnlagFom: '2019-06-01',
  aktivitetStatus: {
    kode: aktivitetstatuskode,
    kodeverk: 'AKTIVITET_STATUS',
  },
  beregningsperiodeFom: '2019-06-01',
  beregningsperiodeTom: '2019-08-31',
  beregnetPrAar,
  fastsattForrigePrAar: null,
  overstyrtPrAar,
  bruttoPrAar: overstyrtPrAar || beregnetPrAar,
  avkortetPrAar: 360000,
  redusertPrAar: 599000,
  erTidsbegrensetArbeidsforhold,
  skalFastsetteGrunnlag,
  erNyIArbeidslivet: null,
  lonnsendringIBeregningsperioden: null,
  andelsnr: 1,
  inntektskategori: {
    kode: 'ARBEIDSTAKER',
    kodeverk: 'INNTEKTSKATEGORI',
  },
  arbeidsforhold: {
    arbeidsgiverId: '910909088',
    startdato: '2018-10-09',
    opphoersdato: null,
    arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
    arbeidsforholdType: {
      kode: 'ARBEID',
      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
    },
    aktørId: null,
    refusjonPrAar: 360000,
    belopFraInntektsmeldingPrMnd: 30000,
    organisasjonstype: {
      kode: 'VIRKSOMHET',
      kodeverk: 'ORGANISASJONSTYPE',
    },
    naturalytelseBortfaltPrÅr: null,
    naturalytelseTilkommetPrÅr: null,
  },
  lagtTilAvSaksbehandler: false,
  belopPrMndEtterAOrdningen: 30000,
  belopPrAarEtterAOrdningen: 360000,
  dagsats: 1385,
  originalDagsatsFraTilstøtendeYtelse: null,
  fordeltPrAar: null,
  erTilkommetAndel: false,
});

const lagPeriode = (andelsliste, dagsats, fom, tom, periodeAarsaker) => ({
  beregningsgrunnlagPeriodeFom: fom,
  beregningsgrunnlagPeriodeTom: tom,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  periodeAarsaker,
  dagsats,
  beregningsgrunnlagPrStatusOgAndel: andelsliste,
  andelerLagtTilManueltIForrige: [],
});

const lagSammenligningsGrunnlag = (kode, rapportertPrAar, avvikProsent, differanse) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar,
  avvikPromille: avvikProsent ? avvikProsent * 10 : 0,
  avvikProsent,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: differanse,
});

const lagPeriodeMedDagsats = (andelsliste, dagsats) => lagPeriode(andelsliste, dagsats, standardFom, standardTom, []);

const lagStandardPeriode = andelsliste => lagPeriode(andelsliste, null, standardFom, standardTom, []);

const lagTidsbegrensetPeriode = (andelsliste, fom, tom) =>
  lagPeriode(andelsliste, null, fom, tom, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }]);

const lagStatus = kode => ({
  kode,
  kodeverk: 'AKTIVITET_STATUS',
});

const lagBG = (perioder, statuser, sammenligningsgrunnlagPrStatus, grunnbeløp = 99858) => {
  const beregningsgrunnlag = {
    skjaeringstidspunktBeregning: '2019-09-16',
    skjæringstidspunkt: '2019-09-16',
    vilkårsperiodeFom: '2019-09-16',
    aktivitetStatus: statuser,
    beregningsgrunnlagPeriode: perioder,
    dekningsgrad: 80,
    grunnbeløp,
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-09-01',
      sammenligningsgrunnlagTom: '2019-08-31',
      rapportertPrAar: 330000,
      avvikPromille: 91,
      avvikProsent: 9,
    },
    sammenligningsgrunnlagPrStatus,
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
    halvG: grunnbeløp/2,
    faktaOmBeregning: {
      kortvarigeArbeidsforhold: null,
      frilansAndel: null,
      kunYtelse: null,
      faktaOmBeregningTilfeller: null,
      arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
      arbeidsforholdMedLønnsendringUtenIM: null,
      vurderMottarYtelse: null,
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2019-09-16',
            aktivitete: [
              {
                arbeidsgiverId: '910909088',
                fom: '2018-10-09',
                tom: '9999-12-31',
                arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
                aktørId: null,
                skalBrukes: null,
              },
            ],
          },
        ],
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 30000,
          fastsattBelop: null,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          refusjonskrav: 30000,
          visningsnavn: 'BEDRIFT AS (910909088) ...55bb',
          arbeidsforhold: {
            arbeidsgiverId: '910909088',
            startdato: '2018-10-09',
            opphoersdato: null,
            arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            aktørId: null,
            refusjonPrAar: null,
            belopFraInntektsmeldingPrMnd: 30000,
            organisasjonstype: {
              kode: 'VIRKSOMHET',
              kodeverk: 'ORGANISASJONSTYPE',
            },
            naturalytelseBortfaltPrÅr: null,
            naturalytelseTilkommetPrÅr: null,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: null,
      refusjonskravSomKommerForSentListe: null,
      saksopplysninger: {
        arbeidsforholdMedLønnsendring: [],
      }
    },
    hjemmel: {
      kode: 'F_14_7_8_30',
      kodeverk: 'BG_HJEMMEL',
    },
    faktaOmFordeling: null,
    årsinntektVisningstall: 360000,
    sammenligningsgrunnlagInntekter: [
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 31800,
        dato: '2018-09-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2018-09-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 33450,
        dato: '2018-10-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2018-10-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 33559,
        dato: '2018-11-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 10000,
        dato: '2018-11-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 41800,
        dato: '2018-12-01',
      },

      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39450,
        dato: '2019-01-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-01-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39559,
        dato: '2019-02-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-02-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 38800,
        dato: '2019-03-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-03-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39450,
        dato: '2019-04-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-04-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 38559,
        dato: '2019-05-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-05-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39600,
        dato: '2019-06-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 64000,
        dato: '2019-06-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 49993,
        dato: '2019-07-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 55000,
        dato: '2019-07-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 48237,
        dato: '2019-08-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 30000,
        dato: '2019-08-01',
      },
    ],
  };
  return beregningsgrunnlag;
};

export default {
  title: 'prosess/prosess-beregningsgrunnlag',
  component: BeregningsgrunnlagProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const arbeidstakerUtenAvvik = () => {
  const andeler = [lagAndel('AT', 450000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1384.6153)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 330257, 6.2, -30257)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const brukersAndelUtenAvvik = () => {
  const andeler = [lagAndel('BA', 34230, undefined, false), lagAndel('AT', 534230, undefined, false)];

  const perioder = [lagPeriodeMedDagsats(andeler, 2340)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 564000;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('BA'), lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -67059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerMedAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 25.009999999, -79059),
  ];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.sammenligningsgrunnlagInntekter;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const militær = () => {
  const andeler = [lagAndel('AT', 110232, undefined, false), lagAndel('MS', 300000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('AT'), lagStatus('MS')];
  const bg = lagBG(perioder, statuser);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const selvstendigNæringsdrivende = () => {
  const andeler = [lagAndel('SN', 300000, undefined, false, true)];
  // const perioder = [lagPeriodeMedDagsats(andeler, null, true)];
  // const statuser = [lagStatus('SN')];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  andeler[0].erNyIArbeidslivet = false;

  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie. ' +
        'Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2016-05-01',
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: true,
      oppgittInntekt: 474257,
      oppstartsdato: '2015-11-01',
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnskapsfører Regn S. Fører',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
    },
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: null,
      oppstartsdato: '2015-11-01',
      opphoersdato: '201-03-01',
      orgnr: '910909077',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'JORDBRUK_SKOGBRUK', kodeverk: 'VIRKSOMHET_TYPE' },
      virksomhetNavn: 'Navn Navnesen',
    },
  ];
  andeler[0].næringer = næringer;
  // const sammenligningsgrunnlagPrStatus = [
  //   lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.21243, -177059),
  // ];
  // const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      // beregningsgrunnlag={[bg, bg]}
      beregningsgrunnlag={[
        {
          skjaeringstidspunktBeregning: '2020-04-27',
          skjæringstidspunkt: '2020-04-27',
          aktivitetStatus: [
            {
              kode: 'SN',
              kodeverk: 'AKTIVITET_STATUS',
            },
          ],
          beregningsgrunnlagPeriode: [
            {
              beregningsgrunnlagPeriodeFom: '2020-04-27',
              beregningsgrunnlagPeriodeTom: '9999-12-31',
              beregnetPrAar: 208193.35,
              bruttoPrAar: 208193.35,
              bruttoInkludertBortfaltNaturalytelsePrAar: 208193.35,
              periodeAarsaker: [],
              beregningsgrunnlagPrStatusOgAndel: [
                {
                  dtoType: 'SN',
                  beregningsgrunnlagFom: '2017-01-01',
                  beregningsgrunnlagTom: '2019-12-31',
                  aktivitetStatus: {
                    kode: 'SN',
                    kodeverk: 'AKTIVITET_STATUS',
                  },
                  beregningsperiodeFom: '2017-01-01',
                  beregningsperiodeTom: '2019-12-31',
                  beregnetPrAar: 208193.35,
                  bruttoPrAar: 208193.35,
                  andelsnr: 1,
                  inntektskategori: {
                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  arbeidsforhold: {
                    arbeidsforholdType: {
                      kode: 'NÆRING',
                      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                  },
                  fastsattAvSaksbehandler: false,
                  lagtTilAvSaksbehandler: false,
                  erTilkommetAndel: false,
                  skalFastsetteGrunnlag: true,
                  pgiSnitt: 208193,
                  pgiVerdier: [
                    {
                      beløp: 202007,
                      årstall: 2019,
                    },
                    {
                      beløp: 208472,
                      årstall: 2018,
                    },
                    {
                      beløp: 214101,
                      årstall: 2017,
                    },
                  ],
                  næringer: [
                    {
                      orgnr: '910909088',
                      erVarigEndret: true,
                      erNyoppstartet: false,
                      virksomhetType: {
                        inntektskategori: {
                          kode: '-',
                          kodeverk: 'INNTEKTSKATEGORI',
                        },
                        kode: 'ANNEN',
                        kodeverk: 'VIRKSOMHET_TYPE',
                      },
                      endringsdato: '2021-05-21',
                      oppstartsdato: '2020-03-27',
                      opphørsdato: '2020-05-27',
                      kanRegnskapsførerKontaktes: false,
                      erNyIArbeidslivet: false,
                      oppgittInntekt: 5000,
                    },
                  ],
                },
              ],
            },
          ],
          sammenligningsgrunnlag: {
            sammenligningsgrunnlagFom: '2021-05-01',
            sammenligningsgrunnlagTom: '2021-05-31',
            rapportertPrAar: 5000,
            avvikPromille: 975.9838631,
            avvikProsent: 97.59838631,
            sammenligningsgrunnlagType: {
              kode: 'SAMMENLIGNING_ATFL_SN',
              kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
            },
            differanseBeregnet: 203193,
          },
          sammenligningsgrunnlagPrStatus: [
            {
              sammenligningsgrunnlagFom: '2021-05-01',
              sammenligningsgrunnlagTom: '2021-05-31',
              rapportertPrAar: 5000,
              avvikPromille: 975.9838631,
              avvikProsent: 97.59838631,
              sammenligningsgrunnlagType: {
                kode: 'SAMMENLIGNING_ATFL_SN',
                kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
              },
              differanseBeregnet: 203193,
            },
          ],
          halvG: 49929,
          grunnbeløp: 99858,
          faktaOmBeregning: {
            avklarAktiviteter: {
              aktiviteterTomDatoMapping: [
                {
                  tom: '2020-04-27',
                  aktiviteter: [
                    {
                      fom: '2020-03-27',
                      tom: '2020-05-27',
                      arbeidsforholdType: {
                        kode: 'NÆRING',
                        kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                      },
                    },
                  ],
                },
              ],
              skjæringstidspunkt: '2020-04-27',
            },
            andelerForFaktaOmBeregning: [
              {
                fastsattBelop: 17349.4458333333,
                inntektskategori: {
                  kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                  kodeverk: 'INNTEKTSKATEGORI',
                },
                aktivitetStatus: {
                  kode: 'SN',
                  kodeverk: 'AKTIVITET_STATUS',
                },
                visningsnavn: 'Næring',
                arbeidsforhold: {
                  arbeidsforholdType: {
                    kode: 'NÆRING',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
                andelsnr: 1,
                skalKunneEndreAktivitet: false,
                lagtTilAvSaksbehandler: false,
              },
            ],
          },
          hjemmel: {
            kode: 'F_9_9_8_35',
            kodeverk: 'BG_HJEMMEL',
          },
          årsinntektVisningstall: 208193,
          dekningsgrad: 100,
          ytelsesspesifiktGrunnlag: {
            ytelsetype: 'OMP',
            skalAvviksvurdere: true,
          },
          erOverstyrtInntekt: false,
          vilkårsperiodeFom: '2020-04-27',
        },
        {
          skjaeringstidspunktBeregning: '2020-05-04',
          skjæringstidspunkt: '2020-05-04',
          aktivitetStatus: [
            {
              kode: 'SN',
              kodeverk: 'AKTIVITET_STATUS',
            },
          ],
          beregningsgrunnlagPeriode: [
            {
              beregningsgrunnlagPeriodeFom: '2020-05-04',
              beregningsgrunnlagPeriodeTom: '9999-12-31',
              beregnetPrAar: 211306.1,
              bruttoPrAar: 211306.1,
              bruttoInkludertBortfaltNaturalytelsePrAar: 211306.1,
              periodeAarsaker: [],
              beregningsgrunnlagPrStatusOgAndel: [
                {
                  dtoType: 'SN',
                  beregningsgrunnlagFom: '2017-01-01',
                  beregningsgrunnlagTom: '2019-12-31',
                  aktivitetStatus: {
                    kode: 'SN',
                    kodeverk: 'AKTIVITET_STATUS',
                  },
                  beregningsperiodeFom: '2017-01-01',
                  beregningsperiodeTom: '2019-12-31',
                  beregnetPrAar: 211306.1,
                  bruttoPrAar: 211306.1,
                  andelsnr: 1,
                  inntektskategori: {
                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  arbeidsforhold: {
                    arbeidsforholdType: {
                      kode: 'NÆRING',
                      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                  },
                  fastsattAvSaksbehandler: false,
                  lagtTilAvSaksbehandler: false,
                  erTilkommetAndel: false,
                  skalFastsetteGrunnlag: true,
                  pgiSnitt: 211306,
                  pgiVerdier: [
                    {
                      beløp: 205027,
                      årstall: 2019,
                    },
                    {
                      beløp: 211589,
                      årstall: 2018,
                    },
                    {
                      beløp: 217303,
                      årstall: 2017,
                    },
                  ],
                  næringer: [
                    {
                      orgnr: '910909088',
                      erVarigEndret: true,
                      erNyoppstartet: false,
                      virksomhetType: {
                        inntektskategori: {
                          kode: '-',
                          kodeverk: 'INNTEKTSKATEGORI',
                        },
                        kode: 'ANNEN',
                        kodeverk: 'VIRKSOMHET_TYPE',
                      },
                      endringsdato: '2021-05-21',
                      oppstartsdato: '2020-03-27',
                      opphørsdato: '2020-05-27',
                      kanRegnskapsførerKontaktes: false,
                      erNyIArbeidslivet: false,
                      oppgittInntekt: 5000,
                    },
                  ],
                },
              ],
            },
          ],
          sammenligningsgrunnlag: {
            sammenligningsgrunnlagFom: '2021-05-01',
            sammenligningsgrunnlagTom: '2021-05-31',
            rapportertPrAar: 5000,
            avvikPromille: 976.3376445,
            avvikProsent: 97.63376445,
            sammenligningsgrunnlagType: {
              kode: 'SAMMENLIGNING_ATFL_SN',
              kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
            },
            differanseBeregnet: 206306,
          },
          sammenligningsgrunnlagPrStatus: [
            {
              sammenligningsgrunnlagFom: '2021-05-01',
              sammenligningsgrunnlagTom: '2021-05-31',
              rapportertPrAar: 5000,
              avvikPromille: 976.3376445,
              avvikProsent: 97.63376445,
              sammenligningsgrunnlagType: {
                kode: 'SAMMENLIGNING_ATFL_SN',
                kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
              },
              differanseBeregnet: 206306,
            },
          ],
          halvG: 50675.5,
          grunnbeløp: 101351,
          faktaOmBeregning: {
            avklarAktiviteter: {
              aktiviteterTomDatoMapping: [
                {
                  tom: '2020-05-04',
                  aktiviteter: [
                    {
                      fom: '2020-03-27',
                      tom: '2020-05-27',
                      arbeidsforholdType: {
                        kode: 'NÆRING',
                        kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                      },
                    },
                  ],
                },
              ],
              skjæringstidspunkt: '2020-05-04',
            },
            andelerForFaktaOmBeregning: [
              {
                fastsattBelop: 17608.8416666667,
                inntektskategori: {
                  kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                  kodeverk: 'INNTEKTSKATEGORI',
                },
                aktivitetStatus: {
                  kode: 'SN',
                  kodeverk: 'AKTIVITET_STATUS',
                },
                visningsnavn: 'Næring',
                arbeidsforhold: {
                  arbeidsforholdType: {
                    kode: 'NÆRING',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
                andelsnr: 1,
                skalKunneEndreAktivitet: false,
                lagtTilAvSaksbehandler: false,
              },
            ],
          },
          hjemmel: {
            kode: 'F_9_9_8_35',
            kodeverk: 'BG_HJEMMEL',
          },
          årsinntektVisningstall: 211306,
          dekningsgrad: 100,
          ytelsesspesifiktGrunnlag: {
            ytelsetype: 'OMP',
            skalAvviksvurdere: true,
          },
          erOverstyrtInntekt: false,
          vilkårsperiodeFom: '2020-05-04',
        },
      ]}
      // aksjonspunkter={lagAPMedKode(
      //   aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      // )}
      aksjonspunkter={[
        {
          aksjonspunktType: {
            kode: 'MANU',
            kodeverk: 'AKSJONSPUNKT_TYPE',
          },
          begrunnelse: null,
          besluttersBegrunnelse: null,
          definisjon: {
            kode: '5039',
            kodeverk: 'AKSJONSPUNKT_DEF',
          },
          erAktivt: true,
          fristTid: null,
          kanLoses: true,
          status: {
            kode: 'OPPR',
            kodeverk: 'AKSJONSPUNKT_STATUS',
          },
          toTrinnsBehandling: true,
          toTrinnsBehandlingGodkjent: null,
          vilkarType: {
            kode: 'FP_VK_41',
            kodeverk: 'VILKAR_TYPE',
          },
          vurderPaNyttArsaker: null,
          venteårsak: {
            kode: '-',
            kodeverk: 'VENT_AARSAK',
          },
        },
      ]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      // isAksjonspunktOpen={false}
      isAksjonspunktOpen
      // vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
      //   bg.skjaeringstidspunktBeregning,
      //   bg.skjaeringstidspunktBeregning,
      // ])}
      vilkar={[
        {
          vilkarType: {
            kode: 'FP_VK_41',
            kodeverk: 'VILKAR_TYPE',
          },
          lovReferanse: '§ 8',
          overstyrbar: true,
          perioder: [
            {
              avslagKode: null,
              merknadParametere: {},
              vilkarStatus: {
                kode: 'IKKE_VURDERT',
                kodeverk: 'VILKAR_UTFALL_TYPE',
              },
              periode: {
                fom: '2020-04-27',
                tom: '2020-04-27',
              },
              begrunnelse: null,
              vurdersIBehandlingen: true,
            },
            {
              avslagKode: null,
              merknadParametere: {},
              vilkarStatus: {
                kode: 'IKKE_VURDERT',
                kodeverk: 'VILKAR_UTFALL_TYPE',
              },
              periode: {
                fom: '2020-05-04',
                tom: '2020-05-04',
              },
              begrunnelse: null,
              vurdersIBehandlingen: true,
            },
          ],
        },
      ]}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const tidsbegrensetArbeidsforholdMedAvvik = () => {
  const andeler = [
    lagAndel('AT', 300000, undefined, false, true),
    lagAndel('AT', 132250, undefined, true, true),
    lagAndel('AT', 140250, undefined, true, true),
    lagAndel('FL', 133250, undefined, undefined),
  ];
  andeler[0].arbeidsforhold = lagArbeidsforhold('Andeby bank', '987654321', 'sdefsef-swdefsdf-sdf-sdfdsf-ddsdf', '100');
  andeler[1].arbeidsforhold = lagArbeidsforhold(
    'Gardslien transport og Gardiner AS',
    '9478541223',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    '200',
    '2019-11-11',
  );
  andeler[2].arbeidsforhold = lagArbeidsforhold(
    'Svaneby sykehjem',
    '93178545',
    'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845',
    '300',
  );
  andeler[1].arbeidsforhold.stillingsProsent = '60';
  andeler[1].arbeidsforhold.stillingsNavn = 'Butikkmedarbeider';
  const perioder = [
    lagPeriode(andeler, undefined, '2019-09-16', '2019-09-29', []),
    lagTidsbegrensetPeriode(andeler, '2019-09-30', '2019-10-15'),
    lagPeriode(andeler, undefined, '2019-10-15', null, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }]),
  ];
  const statuser = [lagStatus('AT_FL')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerFrilanserOgSelvstendigNæringsdrivende = () => {
  const andeler = [
    lagAndel('SN', 300000, undefined, undefined, true),
    lagAndel('AT', 130250, undefined, undefined),
    lagAndel('FL', 230250, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL_SN')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(
        aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      )}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const naturalYtelse = () => {
  const andel1 = lagAndel('AT', 240000, undefined, undefined);
  const andel2 = lagAndel('AT', 740000, 744000, undefined);
  const andel3 = lagAndel('AT', 750000, 755000, undefined);
  andel1.arbeidsforhold.arbeidsgiverId = '9109090881';
  andel2.arbeidsforhold.arbeidsgiverId = '9109090882';
  andel3.arbeidsforhold.arbeidsgiverId = '9109090883';
  andel2.bortfaltNaturalytelse = 2231;
  andel3.bortfaltNaturalytelse = 3231;
  andel1.dekningsgrad = 100;
  andel2.dekningsgrad = 80;
  andel3.dekningsgrad = 80;
  delete andel1.bortfaltNaturalytelse;
  const statuser = [lagStatus('AT')];
  const periode1 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }], 4432, '2019-03-21', '2019-05-31', [
    { kode: periodeAarsak.NATURALYTELSE_BORTFALT },
  ]);
  andel1.bortfaltNaturalytelse = 1231;
  delete andel2.bortfaltNaturalytelse;
  delete andel3.bortfaltNaturalytelse;
  const periode2 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }], 2432, '2019-06-01', '2019-07-30', [
    { kode: periodeAarsak.NATURALYTELSE_BORTFALT },
  ]);
  const periode3 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }], 3432, '2019-08-01', '2019-09-30', [
    { kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET },
  ]);

  const perioder = [periode1, periode2, periode3];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 432000;
  perioder[0].redusertPrAar = 399148;
  perioder[1].bruttoInkludertBortfaltNaturalytelsePrAar = 732000;
  perioder[1].redusertPrAar = 499148;
  perioder[1].avkortetPrAar = 599148;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -79059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerDagpengerOgSelvstendigNæringsdrivende = () => {
  const andeler = [
    lagAndel('AT', 596000, undefined, undefined),
    lagAndel('DP', 331000, undefined, undefined),
    lagAndel('SN', 331000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 154985;
  const statuser = [lagStatus('AT_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 923)];
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerOgSelvstendigNæringsdrivendeUtenAkjsonspunkt = () => {
  const andeler = [lagAndel('SN', 328105, undefined, undefined, false), lagAndel('AT', 72194, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 400299;

  const perioder = [lagPeriodeMedDagsats(andeler, andeler[0].pgiSnitt / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;

  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 1500000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerOgFrilansOgSelvstendigNæringsdrivendeMedAksjonspunktBehandlet = () => {
  const andeler = [
    lagAndel('SN', 331000, undefined, undefined, true),
    lagAndel('AT', 355000, undefined, undefined, false),
    lagAndel('FL', 311000, undefined, undefined, false),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 654985;
  // const perioder = [lagStandardPeriode(andeler)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 379318;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1347316;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: true,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 1500000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(
        aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      )}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerDagpengerOgSelvstendigNæringsdrivendeUtenAksjonspunkt = () => {
  const andeler = [
    lagAndel('SN', 107232, undefined, undefined, false),
    lagAndel('DP', 143000, undefined, undefined, false),
    lagAndel('FL', 343000, undefined, undefined, false),
  ];

  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;
  perioder[0].avkortetPrAar = 599148;
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 754985;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: true,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 1500000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'DAGMAMMA', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerMed3Arbeidsforhold2ISammeOrganisasjonSide3 = () => {
  const andeler = [
    lagAndel('AT', 395232, undefined, false),
    lagAndel('AT', 78000, undefined, false),
    lagAndel('AT', 88084, undefined, false),
  ];
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Garslien transport og Gardiner',
    '9478541223',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
  );
  andeler[1].arbeidsforhold = lagArbeidsforhold(
    'Aldersheimen Omsorg',
    '9478541255',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    '100',
  );
  andeler[2].arbeidsforhold = lagArbeidsforhold(
    'Aldersheimen Omsorg',
    '9478541255',
    'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845',
    '200',
    '2019-11-11',
  );
  andeler[1].arbeidsforhold.stillingsProsent = '30';
  andeler[1].arbeidsforhold.stillingsNavn = 'Assistent';
  andeler[2].arbeidsforhold.stillingsProsent = '17,5';
  andeler[2].arbeidsforhold.stillingsNavn = 'Assistent';
  const perioder = [lagPeriodeMedDagsats(andeler, 1696)];
  perioder[0].redusertPrAar = 441053;
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 16.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerAvslagHalvGSide4 = () => {
  const andeler = [lagAndel('AT', 32232, undefined, false, false)];
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Gardslien transport og Gardiner',
    '123456789',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    '324243533',
    '',
    'Butikkkmedarbeider',
    '75',
  );
  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;

  const statuser = [lagStatus('AT')];

  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, -42673, 26.2, -7131)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      readOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerMedAksjonspunktSide5 = () => {
  const andeler = [lagAndel('AT', 348576, undefined, false, true)];
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Bedriften & Sønn AS',
    '123456789',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    null,
    null,
    'Fabrikkmedarbeider',
    75,
  );
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.AT, 169647, 105.4, 178929)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerMedAksjonspunktBehandletSide6 = () => {
  const andeler = [lagAndel('AT', 348576, undefined, false, true)];
  andeler[0].overstyrtPrAar = 522864;
  andeler[0].bruttoPrAar = 522864;

  const perioder = [lagPeriodeMedDagsats(andeler, 441053 / 260)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.AT, 169647, 105.4, 178929)];
  perioder[0].redusertPrAar = 441053;
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';
  ap[0].endretAv = 'B123456';
  ap[0].endretTidspunkt = '2020-01-20';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const tidsbegrensetArbeidsforholdMedAksjonspunktkSide7 = () => {
  const andeler = [lagAndel('AT', 395232, undefined, false, true), lagAndel('AT', 156084, undefined, true, true)];
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Gardslien transport og Gardiner AS',
    '9478541223',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    '100',
  );
  andeler[1].arbeidsforhold = lagArbeidsforhold(
    'Aldersheimen Omsorg',
    '93178545',
    'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845',
    '200',
    '2019-11-11',
  );
  andeler[0].arbeidsforhold.stillingsProsent = '60';
  andeler[0].arbeidsforhold.stillingsNavn = 'Butikkmedarbeider';
  andeler[1].arbeidsforhold.stillingsProsent = '30';
  andeler[1].arbeidsforhold.stillingsNavn = 'Assistent';
  const perioder = [
    lagPeriode(andeler, undefined, '2019-09-16', '2019-09-29', []),
    lagTidsbegrensetPeriode(andeler, '2019-09-30', '2019-10-15'),
  ];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 404257, 36.4, 147059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const tidsbegrensetArbeidsforholdMedAksjonspunktBehandletSide7 = () => {
  const andeler = [lagAndel('AT', 395232, undefined, false, true), lagAndel('AT', 156084, undefined, true, true)];
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Gardslien transport og Gardiner AS',
    '9478541223',
    'sdefsef-swdefsdf-sdf-sdfdsf-98das',
    '100',
  );
  andeler[1].arbeidsforhold = lagArbeidsforhold(
    'Aldersheimen Omsorg',
    '93178545',
    'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845',
    '200',
    '2019-11-11',
  );
  andeler[0].arbeidsforhold.stillingsProsent = '60';
  andeler[0].arbeidsforhold.stillingsNavn = 'Butikkmedarbeider';
  andeler[1].arbeidsforhold.stillingsProsent = '30';
  andeler[1].arbeidsforhold.stillingsNavn = 'Assistent';
  const klonetAndeler = JSON.parse(JSON.stringify(andeler));
  const perioder = [
    lagPeriode(andeler, undefined, '2019-09-16', '2019-09-29', []),
    lagTidsbegrensetPeriode(klonetAndeler, '2019-09-30', '2019-10-15'),
  ];

  perioder[0].dagsats = 1696;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 551316;
  perioder[0].bruttoPrAar = 551316;
  perioder[0].redusertPrAar = 441053;
  perioder[1].dagsats = 1216;
  perioder[1].bruttoInkludertBortfaltNaturalytelsePrAar = 395232;
  perioder[1].bruttoPrAar = 395232;
  perioder[1].redusertPrAar = 316187;

  perioder[0].beregningsgrunnlagPrStatusOgAndel[0].overstyrtPrAar = 395232;
  perioder[0].beregningsgrunnlagPrStatusOgAndel[1].overstyrtPrAar = 156084;
  perioder[1].beregningsgrunnlagPrStatusOgAndel[0].overstyrtPrAar = 395232;
  perioder[1].beregningsgrunnlagPrStatusOgAndel[0].bruttoPrAar = 395232;
  perioder[1].beregningsgrunnlagPrStatusOgAndel[1].overstyrtPrAar = 0;
  perioder[1].beregningsgrunnlagPrStatusOgAndel[1].bruttoPrAar = 0;

  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 404257, 36.4, 147059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const FrilansSide8 = () => {
  const andeler = [lagAndel('FL', 551316, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1696)];
  perioder[0].redusertPrAar = 441053;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 441053;
  const statuser = [lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.FL, 474257, 16.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const FrilansMedAksjonspunktSide9 = () => {
  const andeler = [lagAndel('FL', 671316, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;

  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.FL, 504257, 33.1, 167000)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerFrilansMedAksjonspunktSide10 = () => {
  const andeler = [lagAndel('AT', 551316, undefined, false, false), lagAndel('FL', 596000, undefined, false, true)];
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.AT, 474257, 16.2, 77059),
    lagSammenligningsGrunnlag(sammenligningType.FL, 159000, 274.8135, 437000),
  ];

  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerFrilansMedAksjonspunktBehandletSide11 = () => {
  const andeler = [lagAndel('AT', 551316, undefined, false, false), lagAndel('FL', 596000, undefined, false, true)];
  andeler[1].overstyrtPrAar = 159000;
  andeler[1].bruttoPrAar = 159000;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];
  const statuser = [lagStatus('AT'), lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.AT, 474257, 16.2, 77059),
    lagSammenligningsGrunnlag(sammenligningType.FL, 159000, 274.8135, 437000),
  ];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';
  perioder[0].redusertPrAar = 479318;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 710316;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const SelvstendigNæringsdrivendeUtenVarigEndringIkkeNyoppstartetSide12 = () => {
  const andeler = [lagAndel('SN', 631129, undefined, undefined, false)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 599148 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  perioder[0].avkortetPrAar = 599148;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse: '',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 1500000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const SelvstendigNæringsdrivendeMedVarigEndringSide13 = () => {
  const andeler = [lagAndel('SN', 631129, undefined, undefined, false)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 599148 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  perioder[0].avkortetPrAar = 599148;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie.' +
        ' Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 755000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      virksomhetNavn: 'Jensen frisør og hudpleie',
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: null,
      oppstartsdato: '2015-11-01',
      opphoersdato: '2010-03-01',
      orgnr: '910909077',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'JORDBRUK_SKOGBRUK', kodeverk: 'VIRKSOMHET_TYPE' },
      virksomhetNavn: 'Berit Jensen',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 755000, 18, -113871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const SelvstendigNæringsdrivendeMedVarigEndringMedAksjonspunktSide14 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie. ' +
        'Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2019-05-01',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(
        aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      )}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const SelvstendigNæringsdrivendeMedVarigEndringMedAksjonspunktUtførtSide15 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 522864;
  const perioder = [lagPeriodeMedDagsats(andeler, 522864 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].overstyrtPrAar;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie. ' +
        'Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2019-05-01',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const SelvstendigNæringsdrivendeNyoppstartetMedAksjonspunktSide16 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 174544;
  andeler[0].overstyrtPrAar = 522864;
  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse: '',
      endringsdato: '2019-05-01',
      erNyIArbeidslivet: false,
      erNyoppstartet: true,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 350000,
      oppstartsdato: '2019-05-01',
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 350000, 50.1, -113871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const SelvstendigNæringsdrivendeNyINæringslivetMedAksjonspunktSide17 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 174544;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].erNyIArbeidslivet = true;
  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('SN')];
  const næringer = [
    {
      begrunnelse: '',
      endringsdato: '2019-05-01',
      erNyIArbeidslivet: true,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 350000,
      oppstartsdato: '2019-05-01',
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 300000, 50.1, -113871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET);

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeSnStorreEnnAtOgStorreEnn6gDekningsgrad80Side18 = () => {
  const andeler = [lagAndel('SN', 158806, undefined, undefined, false), lagAndel('AT', 472194, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 479318;

  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: null,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeSnMindreEnnAtOgStorreEnn6gDekningsgrad80Side19 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, false), lagAndel('AT', 814363, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 479318;

  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 1500000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerOgSelvstendigNæringsdrivendeMedAPVarigEndringSide20 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true), lagAndel('AT', 551316, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;

  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.dekningsgrad;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(
        aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      )}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeMedVarigEndringApBehandletSide21 = () => {
  const andeler = [lagAndel('SN', 531000, undefined, undefined, true), lagAndel('AT', 551316, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1331658;
  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeAtStorreEnnSNMedVarigEndringSide22 = () => {
  const andeler = [lagAndel('SN', 0, 780342, undefined, true), lagAndel('AT', 851316, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1331658;
  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeAtStorreEnnSNSide22 = () => {
  const andeler = [lagAndel('SN', 0, 0, undefined, true), lagAndel('AT', 851316, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = null;
  andeler[0].beregnetPrAar = 0;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1331658;
  const statuser = [lagStatus('AT_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = [];
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedApOgVarigEndringSide23 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 24000, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.dekningsgrad;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={lagAPMedKode(
        aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      )}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedApOgVarigEndringSide24 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 24000, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1400342;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie.' +
        ' Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetNavn: 'Jensen frisør og hudpleie',
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedAPVarigEndringSnMindreEnnATFLSide25 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 551316, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1147342;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [
    {
      begrunnelse:
        'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie.' +
        ' Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2019-10-20',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 900000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetNavn: 'Jensen frisør og hudpleie',
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  ap[0].begrunnelse =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const YtelseFraNavSide26 = () => {
  const andeler = [lagAndel('KUN_YTELSE', 395232, undefined, undefined)];
  const statuser = [lagStatus('KUN_YTELSE')];
  const perioder = [lagPeriodeMedDagsats(andeler, 1215)];
  perioder[0].redusertPrAar = 316000;
  perioder[0].bruttoPrAar = 395232;
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgAAPMedAksjonspunktSide27 = () => {
  const andeler = [lagAndel('AT', 107232, undefined, false, true), lagAndel('AAP', 272304, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('AT'), lagStatus('AAP')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 313536, 65.8, -206304)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const arbeidstakerOgAAPMedAksjonspunktOppfyltSide27 = () => {
  const andeler = [lagAndel('AT', 107232, undefined, false, true), lagAndel('AAP', 272304, undefined, false)];
  andeler[0].overstyrtPrAar = 167000;
  andeler[0].arbeidsforhold = lagArbeidsforhold(
    'Garslinen transport og Gardiner AS',
    '987654321',
    'sdefsef-swdefsdf-sdf-sdfdsf-ddsdf',
  );
  const perioder = [lagPeriodeMedDagsats(andeler, 379536 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 379536;
  delete perioder[0].redusertPrAar;
  const statuser = [lagStatus('AT'), lagStatus('AAP')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 313536, 65.8, -206304)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  const ap = lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  ap[0].begrunnelse = 'Endring  begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const frilansDagpengerOgSelvstendigNæringsdrivendeSide29 = () => {
  const andeler = [
    lagAndel('FL', 40824, undefined, undefined),
    lagAndel('DP', 272304, undefined, undefined),
    lagAndel('SN', 318001, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 631129;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 631129;
  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const frilansDagpengerOgSelvstendigNæringsdrivendeFnOgDpOverstigerSNSide30 = () => {
  const andeler = [
    lagAndel('FL', 40824, undefined, undefined),
    lagAndel('DP', 272304, undefined, undefined),
    lagAndel('SN', 112447, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 112447;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 313128 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 313128;
  perioder[0].beregnetPrAar = 313128;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 57000, 1007.2, -574129)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const ArbeidstagerDagpengerOgSelvstendigNæringsdrivendeATOgDpOverstigerSN = () => {
  const andeler = [
    lagAndel('AT', 40824, undefined, undefined),
    lagAndel('DP', 272304, undefined, undefined),
    lagAndel('SN', 112447, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 112447;
  const statuser = [lagStatus('AT_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 313128 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 313128;
  perioder[0].beregnetPrAar = 313128;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 57000, 1007.2, -574129)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const frilansDagpengerOgSelvstendigNæringsdrivendeMedAksjonspunktSide31 = () => {
  const andeler = [
    lagAndel('FL', 40824, undefined, undefined),
    lagAndel('DP', 272304, undefined, undefined),
    lagAndel('SN', 631129, undefined, undefined, true),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 631129;
  const næringer = [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: 57000,
      oppstartsdato: null,
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
    },
  ];
  andeler[2].næringer = næringer;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 313128 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 313128;
  perioder[0].beregnetPrAar = 313128;
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 57000, 1007.2, -574129)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  const ap = lagAPMedKode(
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={ap}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};
export const militærOgSiviltjenesteSide33 = () => {
  const andeler = [lagAndel('AT', 155232, undefined, false), lagAndel('MS', 144342, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 922)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 299574;
  perioder[0].redusertPrAar = 239659;
  const statuser = [lagStatus('AT'), lagStatus('MS')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 30000, 17.2, -574129)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const midlertidigInaktivAvslagEnG = () => {
  const andeler = [lagAndel('BA', 32232, undefined, false, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;

  const statuser = [lagStatus('MIDL_INAKTIV')];

  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, -42673, 26.2, -7131)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus, 106399);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      readOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

export const arbeidstakerUtenAvvikMedLonnsendringSisteTreMan = () => {
  const andeler = [lagAndel('AT', 450000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1384.6153)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 330257, 6.2, -30257)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);

  bg.faktaOmBeregning.saksopplysninger.arbeidsforholdMedLønnsendring = [true];

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={[bg, bg]}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT, [
        bg.skjaeringstidspunktBeregning,
        bg.skjaeringstidspunktBeregning,
      ])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
    />
  );
};

