import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme/build';
import { FieldArray } from 'redux-form';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { BeregningFP, buildInitialValuesForBeregningrunnlag, transformValues } from './BeregningFP';
import BeregningForm2 from './beregningForm/BeregningForm';

const lagBeregningsgrunnlag = (ferdigstilt, beregnetPrAar, sammenligningSum, avvikPromille, avklaringsbehov = []) => {
  const beregningsgrunnlag = {
    avklaringsbehov,
    halvG: 30000,
    vilkårsperiodeFom: '2020-01-01',
    ledetekstBrutto: 'Brutto tekst',
    ledetekstAvkortet: 'Avkortet tekst',
    ledetekstRedusert: 'Redusert tekst',
    skjaeringstidspunktBeregning: '12.12.2017',
    årsinntektVisningstall: beregnetPrAar,
    sammenligningsgrunnlag: {
      avvikPromille,
      rapportertPrAar: sammenligningSum,
    },
    aktivitetStatus: [aktivitetStatus.KOMBINERT_AT_SN],
    beregningsgrunnlagPeriode: [
      {
        dagsats: ferdigstilt ? 1500 : undefined,
        beregningsgrunnlagPrStatusOgAndel: [{ aktivitetStatus: aktivitetStatus.KOMBINERT_AT_SN }],
      },
    ],
  };
  return beregningsgrunnlag;
};

const vilkar = [
  {
    vilkarType: 'FP_VK_41',
    vilkarStatus: vilkarUtfallType.OPPFYLT,
  },
];

const beregningreferanserTilVurdering = [
  {
    skjæringstidspunkt: '2020-01-01',
    referanse: 'htfse-324-sfe3332',
    erForlengelse: false,
  },
];

const gjeldendeAksjonspunkter = [
  {
    id: 55,
    erAktivt: true,
    definisjon: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    toTrinnsBehandling: false,
    status: 'OPPR',
    begrunnelse: 'begrunnelse arbeidstaker/frilans',
    vilkarType: null,
    kanLoses: true,
  },
];

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: '-',
  sprakkode: 'NB',
};

const alleKodeverk = {
  test: 'test',
};

describe('<BeregningFP>', () => {
  it('skal teste at det bygges korrekte initialvalues med avklaringsbehov satt på BG', () => {
    const avklaringsbehov = [
      {
        id: 55,
        erAktivt: true,
        definisjon: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
        toTrinnsBehandling: false,
        status: 'OPPR',
        begrunnelse: 'En litt spesiell begrunnelse',
        vilkarType: null,
        kanLoses: true,
      },
    ];
    const initialValues = buildInitialValuesForBeregningrunnlag(
      lagBeregningsgrunnlag(true, 100000, 100000, null, avklaringsbehov),
      vilkar,
    );
    expect(initialValues.avklaringsbehov).to.eql(avklaringsbehov);
    expect(initialValues.relevanteStatuser.isArbeidstaker).to.eql(true);
    expect(initialValues.relevanteStatuser.isSelvstendigNaeringsdrivende).to.eql(true);
    expect(initialValues.relevanteStatuser.isKombinasjonsstatus).to.eql(true);
    expect(initialValues.relevanteStatuser.skalViseBeregningsgrunnlag).to.eql(true);
  });
  it('skal teste at det bygges korrekte initialvalues med beregnetAvvikPromille lik NULL', () => {
    const initialValues = buildInitialValuesForBeregningrunnlag(
      lagBeregningsgrunnlag(true, 100000, 100000, null, gjeldendeAksjonspunkter),
      beregningreferanserTilVurdering,
    );
    expect(initialValues.avklaringsbehov).to.eql(gjeldendeAksjonspunkter);
    expect(initialValues.relevanteStatuser.isArbeidstaker).to.eql(true);
    expect(initialValues.relevanteStatuser.isSelvstendigNaeringsdrivende).to.eql(true);
    expect(initialValues.relevanteStatuser.isKombinasjonsstatus).to.eql(true);
    expect(initialValues.relevanteStatuser.skalViseBeregningsgrunnlag).to.eql(true);
  });
  it('skal teste visning av komponenter når beregningsgrunnlag er lik null', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        beregningsgrunnlag={[null]}
        vilkar={vilkar}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
        beregningreferanserTilVurdering={beregningreferanserTilVurdering}
      />,
    );
    const beregningForm = wrapper.find(BeregningForm2);
    expect(beregningForm).to.be.lengthOf(0);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(2);
    expect(messages.get(0).props.id).to.equal('Beregningsgrunnlag.Title');
    expect(messages.get(1).props.id).to.equal('Beregningsgrunnlag.HarIkkeBeregningsregler');
  });
  it('skal teste visning av komponenter når beregningsgrunnlag ikke er null', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        beregningsgrunnlag={[lagBeregningsgrunnlag(true, 250000, 250000, undefined, gjeldendeAksjonspunkter)]}
        vilkar={vilkar}
        behandling={behandling}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
        beregningreferanserTilVurdering={beregningreferanserTilVurdering}
      />,
    );
    const beregningForm = wrapper.find(FieldArray);
    expect(beregningForm).to.be.lengthOf(1);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(0);
  });

  it('skal teste transform value for flere beregningsgrunnlag aksjonspunkt, men kun siste til vurdering', () => {
    const values = {
      beregningsgrunnlagListe: [
        {
          relevanteStatuser: {
            isArbeidstaker: true,
            isFrilanser: false,
            isSelvstendigNaeringsdrivende: false,
            harAndreTilstotendeYtelser: false,
            harDagpengerEllerAAP: false,
            isAAP: false,
            isDagpenger: false,
            skalViseBeregningsgrunnlag: true,
            isKombinasjonsstatus: false,
            isMilitaer: false,
          },
          avklaringsbehov: [
            {
              definisjon: {
                kode: '5047',
                kodeverk: 'AVKLARINGSBEHOV_DEF',
              },
              status: {
                kode: 'UTFO',
                kodeverk: 'AKSJONSPUNKT_STATUS',
              },
              begrunnelse: 'dfwdwad',
            },
          ],
          erTilVurdering: false,
          skjæringstidspunkt: '2021-07-08',
          ATFLVurdering: 'dfwdwad',
          'inntektField_undefined_1_2021-07-08': '433 500',
          'inntektField_undefined_1_2021-09-01': '433 500',
          inntekt0: '433 500',
        },
        {
          relevanteStatuser: {
            isArbeidstaker: true,
            isFrilanser: false,
            isSelvstendigNaeringsdrivende: false,
            harAndreTilstotendeYtelser: false,
            harDagpengerEllerAAP: false,
            isAAP: false,
            isDagpenger: false,
            skalViseBeregningsgrunnlag: true,
            isKombinasjonsstatus: false,
            isMilitaer: false,
          },
          avklaringsbehov: [
            {
              definisjon: {
                kode: '5038',
                kodeverk: 'AVKLARINGSBEHOV_DEF',
              },
              status: {
                kode: 'OPPR',
                kodeverk: 'AKSJONSPUNKT_STATUS',
              },
            },
          ],
          erTilVurdering: true,
          skjæringstidspunkt: '2021-10-11',
          ATFLVurdering: 'dwadwa',
          'inntektField_c4aa63f5-4132-4156-b5a6-832bd0c81c37_1_2021-10-11': '',
          inntekt0: '231 123',
        },
      ],
    };

    const alleBeregningsgrunnlag = [
      {
        avklaringsbehov: [
          {
            definisjon: {
              kode: '5047',
              kodeverk: 'AVKLARINGSBEHOV_DEF',
            },
            status: {
              kode: 'UTFO',
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            begrunnelse: 'dfwdwad',
          },
        ],
        skjaeringstidspunktBeregning: '2021-07-08',
        skjæringstidspunkt: '2021-07-08',
        aktivitetStatus: [
          {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
        ],
        beregningsgrunnlagPeriode: [
          {
            beregningsgrunnlagPeriodeFom: '2021-07-08',
            beregningsgrunnlagPeriodeTom: '2021-08-31',
            beregnetPrAar: 433500.0,
            bruttoPrAar: 433500.0,
            bruttoInkludertBortfaltNaturalytelsePrAar: 433500.0,
            avkortetPrAar: 433500.0,
            redusertPrAar: 433500.0,
            periodeAarsaker: [],
            dagsats: 1667,
            beregningsgrunnlagPrStatusOgAndel: [
              {
                dtoType: 'GENERELL',
                beregningsgrunnlagFom: '2021-04-01',
                beregningsgrunnlagTom: '2021-06-30',
                aktivitetStatus: {
                  kode: 'AT',
                  kodeverk: 'AKTIVITET_STATUS',
                },
                beregningsperiodeFom: '2021-04-01',
                beregningsperiodeTom: '2021-06-30',
                beregnetPrAar: 433500.0,
                overstyrtPrAar: 433500.0,
                bruttoPrAar: 433500.0,
                avkortetPrAar: 433500.0,
                redusertPrAar: 433500.0,
                erTidsbegrensetArbeidsforhold: true,
                andelsnr: 1,
                inntektskategori: {
                  kode: 'ARBEIDSTAKER',
                  kodeverk: 'INNTEKTSKATEGORI',
                },
                arbeidsforhold: {
                  arbeidsgiverIdent: '111111111',
                  startdato: '2021-06-01',
                  opphoersdato: '2021-08-31',
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                  refusjonPrAar: 433500.0,
                  belopFraInntektsmeldingPrMnd: 36125.0,
                },
                fastsattAvSaksbehandler: false,
                lagtTilAvSaksbehandler: false,
                dagsats: 1667,
                erTilkommetAndel: false,
                skalFastsetteGrunnlag: true,
              },
            ],
          },
          {
            beregningsgrunnlagPeriodeFom: '2021-09-01',
            beregningsgrunnlagPeriodeTom: '9999-12-31',
            beregnetPrAar: 433500.0,
            bruttoPrAar: 433500.0,
            bruttoInkludertBortfaltNaturalytelsePrAar: 433500.0,
            avkortetPrAar: 433500.0,
            redusertPrAar: 0.0,
            periodeAarsaker: [
              {
                kode: 'ARBEIDSFORHOLD_AVSLUTTET',
                kodeverk: 'PERIODE_AARSAK',
              },
            ],
            dagsats: 0,
            beregningsgrunnlagPrStatusOgAndel: [
              {
                dtoType: 'GENERELL',
                beregningsgrunnlagFom: '2021-04-01',
                beregningsgrunnlagTom: '2021-06-30',
                aktivitetStatus: {
                  kode: 'AT',
                  kodeverk: 'AKTIVITET_STATUS',
                },
                beregningsperiodeFom: '2021-04-01',
                beregningsperiodeTom: '2021-06-30',
                beregnetPrAar: 433500.0,
                overstyrtPrAar: 433500.0,
                bruttoPrAar: 433500.0,
                avkortetPrAar: 0.0,
                redusertPrAar: 0.0,
                erTidsbegrensetArbeidsforhold: true,
                andelsnr: 1,
                inntektskategori: {
                  kode: 'ARBEIDSTAKER',
                  kodeverk: 'INNTEKTSKATEGORI',
                },
                arbeidsforhold: {
                  arbeidsgiverIdent: '111111111',
                  startdato: '2021-06-01',
                  opphoersdato: '2021-08-31',
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                  refusjonPrAar: 0.0,
                  belopFraInntektsmeldingPrMnd: 36125.0,
                },
                fastsattAvSaksbehandler: false,
                lagtTilAvSaksbehandler: false,
                dagsats: 0,
                erTilkommetAndel: false,
                skalFastsetteGrunnlag: true,
              },
            ],
          },
        ],
        vilkårsperiodeFom: '2021-07-08',
      },
      {
        avklaringsbehov: [
          {
            definisjon: {
              kode: '5038',
              kodeverk: 'AVKLARINGSBEHOV_DEF',
            },
            status: {
              kode: 'OPPR',
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
          },
        ],
        skjaeringstidspunktBeregning: '2021-10-11',
        skjæringstidspunkt: '2021-10-11',
        aktivitetStatus: [
          {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
        ],
        beregningsgrunnlagPeriode: [
          {
            beregningsgrunnlagPeriodeFom: '2021-10-11',
            beregningsgrunnlagPeriodeTom: '9999-12-31',
            beregnetPrAar: 543100.08,
            bruttoPrAar: 543100.08,
            bruttoInkludertBortfaltNaturalytelsePrAar: 543100.08,
            periodeAarsaker: [],
            beregningsgrunnlagPrStatusOgAndel: [
              {
                dtoType: 'GENERELL',
                beregningsgrunnlagFom: '2021-07-01',
                beregningsgrunnlagTom: '2021-09-30',
                aktivitetStatus: {
                  kode: 'AT',
                  kodeverk: 'AKTIVITET_STATUS',
                },
                beregningsperiodeFom: '2021-07-01',
                beregningsperiodeTom: '2021-09-30',
                beregnetPrAar: 543100.08,
                bruttoPrAar: 543100.08,
                andelsnr: 1,
                inntektskategori: {
                  kode: 'ARBEIDSTAKER',
                  kodeverk: 'INNTEKTSKATEGORI',
                },
                arbeidsforhold: {
                  arbeidsgiverIdent: '999999999',
                  startdato: '2021-09-01',
                  arbeidsforholdId: 'c4aa63f5-4132-4156-b5a6-832bd0c81c37',
                  eksternArbeidsforholdId: 'WFFESF345345',
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                  belopFraInntektsmeldingPrMnd: 45258.34,
                },
                fastsattAvSaksbehandler: false,
                lagtTilAvSaksbehandler: false,
                erTilkommetAndel: false,
                skalFastsetteGrunnlag: true,
              },
            ],
          },
        ],
        halvG: 53199.5,
        grunnbeløp: 106399.0,
        hjemmel: {
          kode: 'F_9_9_8_28_8_30',
          kodeverk: 'BG_HJEMMEL',
        },
        årsinntektVisningstall: 543100.08,
        dekningsgrad: 100,
        erOverstyrtInntekt: false,
        vilkårsperiodeFom: '2021-10-11',
      },
    ];

    const vilk = [
      {
        vilkarType: {
          kode: 'FP_VK_41',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 8',
        overstyrbar: true,
        perioder: [
          {
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2021-07-08',
              tom: '2021-07-20',
            },
            vurderesIBehandlingen: false,
          },
          {
            vilkarStatus: {
              kode: 'IKKE_VURDERT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2021-10-11',
              tom: '2021-10-22',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
    ];

    const transformed = transformValues(values, alleBeregningsgrunnlag, vilk)[0];

    expect(transformed.begrunnelse).to.be.equal('dwadwa');
    expect(transformed.kode).to.be.equal('5038');
    expect(transformed.grunnlag[0].begrunnelse).to.be.equal('dwadwa');
    expect(transformed.grunnlag[0].inntektPrAndelList[0].andelsnr).to.be.equal(1);
    expect(transformed.grunnlag[0].inntektPrAndelList[0].inntekt).to.be.equal(231123);
    expect(transformed.grunnlag[0].kode).to.be.equal('5038');
    expect(transformed.grunnlag[0].periode.fom).to.be.equal('2021-10-11');
    expect(transformed.grunnlag[0].periode.tom).to.be.equal('2021-10-22');
    expect(transformed.grunnlag[0].skjæringstidspunkt).to.be.equal('2021-10-11');
  });
});
