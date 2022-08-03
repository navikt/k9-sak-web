export const beregningsgrunnlag = [
  {
    avklaringsbehov: [
      {
        definisjon: {
          kode: '5058',
          avklaringsbehovType: {
            kode: 'MANU',
            kodeverk: 'AVKLARINGSBEHOV_TYPE',
          },
          stegFunnet: {
            kode: 'KOFAKBER',
            kodeverk: 'BEREGNING_STEG',
          },
          kodeverk: 'AVKLARINGSBEHOV_DEF',
        },
        status: {
          kode: 'OPPR',
          kodeverk: 'AKSJONSPUNKT_STATUS',
        },
        kanLoses: true,
      },
    ],
    skjaeringstidspunktBeregning: '2021-11-17',
    skjæringstidspunkt: '2021-11-17',
    aktivitetStatus: [
      {
        kode: 'AT_FL',
        kodeverk: 'AKTIVITET_STATUS',
      },
    ],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2021-11-17',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-10',
            beregningsperiodeTom: '2021-10-31',
            lonnsendringIBeregningsperioden: true,
            andelsnr: 2,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsgiverIdent: '12345679',
              startdato: '2020-08-10',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
          {
            dtoType: 'GENERELL',
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-01',
            beregningsperiodeTom: '2021-10-31',
            andelsnr: 3,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsgiverIdent: '12345671',
              startdato: '2021-08-16',
              arbeidsforholdId: '4406bf62-ecb5-42b4-9896-28c78858190a',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
              belopFraInntektsmeldingPrMnd: 7454.33,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
          {
            dtoType: 'GENERELL',
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-01',
            beregningsperiodeTom: '2021-10-31',
            andelsnr: 4,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsgiverIdent: '12345671',
              startdato: '2021-08-16',
              arbeidsforholdId: '837771f8-4853-4070-a10f-9aef023951c9',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
              belopFraInntektsmeldingPrMnd: 17402.4,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
          {
            dtoType: 'GENERELL',
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-01',
            beregningsperiodeTom: '2021-10-31',
            lonnsendringIBeregningsperioden: true,
            andelsnr: 5,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsgiverIdent: '795349533',
              startdato: '2021-11-01',
              opphoersdato: '2022-02-28',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
          {
            dtoType: 'GENERELL',
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-01',
            beregningsperiodeTom: '2021-10-31',
            andelsnr: 6,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsgiverIdent: '123456789',
              startdato: '2021-11-01',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
          {
            dtoType: 'FL',
            aktivitetStatus: {
              kode: 'FL',
              kodeverk: 'AKTIVITET_STATUS',
            },
            beregningsperiodeFom: '2021-08-01',
            beregningsperiodeTom: '2021-10-31',
            andelsnr: 1,
            inntektskategori: {
              kode: 'FRILANSER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            arbeidsforhold: {
              arbeidsforholdType: {
                kode: 'FRILANS',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    halvG: 53199.5,
    grunnbeløp: 106399.0,
    faktaOmBeregning: {
      saksopplysninger: {
        arbeidsforholdMedLønnsendring: [
          {
            andelsnr: 5,
            arbeidsgiverIdent: '795349533',
          },
          {
            andelsnr: 2,
            arbeidsgiverIdent: '12345679',
          },
        ],
        kortvarigeArbeidsforhold: [],
      },
      faktaOmBeregningTilfeller: [
        {
          kode: 'VURDER_LØNNSENDRING',
          kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE',
        },
      ],
      arbeidsforholdMedLønnsendringUtenIM: [
        {
          andelsnr: 5,
          arbeidsforhold: {
            arbeidsgiverIdent: '795349533',
            startdato: '2021-11-01',
            opphoersdato: '2022-02-28',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
          },
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          lagtTilAvSaksbehandler: false,
          fastsattAvSaksbehandler: false,
          andelIArbeid: [],
        },
      ],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2021-11-17',
            aktiviteter: [
              {
                fom: '2019-12-01',
                tom: '9999-12-31',
                arbeidsforholdType: {
                  kode: 'FRILANS',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
              {
                arbeidsgiverIdent: '12345679',
                fom: '2021-08-10',
                tom: '9999-12-31',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
              {
                arbeidsgiverIdent: '12345671',
                fom: '2021-08-16',
                tom: '9999-12-31',
                arbeidsforholdId: '4406bf62-ecb5-42b4-9896-28c78858190a',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
              {
                arbeidsgiverIdent: '12345671',
                fom: '2021-08-16',
                tom: '9999-12-31',
                arbeidsforholdId: '837771f8-4853-4070-a10f-9aef023951c9',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
              {
                arbeidsgiverIdent: '795349533',
                fom: '2021-11-01',
                tom: '2022-02-28',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
              {
                arbeidsgiverIdent: '123456789',
                fom: '2021-11-01',
                tom: '9999-12-31',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2021-11-17',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 0,
          inntektskategori: {
            kode: 'FRILANSER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'FL',
            kodeverk: 'AKTIVITET_STATUS',
          },
          arbeidsforhold: {
            arbeidsforholdType: {
              kode: 'FRILANS',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
        {
          belopReadOnly: 4828.05,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          arbeidsforhold: {
            arbeidsgiverIdent: '12345679',
            startdato: '2020-08-10',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
          },
          andelsnr: 2,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
        {
          belopReadOnly: 7454.33,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          refusjonskrav: 7454.33,
          arbeidsforhold: {
            arbeidsgiverIdent: '12345671',
            startdato: '2021-08-16',
            arbeidsforholdId: '4406bf62-ecb5-42b4-9896-28c78858190a',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            belopFraInntektsmeldingPrMnd: 7454.33,
          },
          andelsnr: 3,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
        {
          belopReadOnly: 17402.4,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          refusjonskrav: 17402.4,
          arbeidsforhold: {
            arbeidsgiverIdent: '12345671',
            startdato: '2021-08-16',
            arbeidsforholdId: '837771f8-4853-4070-a10f-9aef023951c9',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            belopFraInntektsmeldingPrMnd: 17402.4,
          },
          andelsnr: 4,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
        {
          belopReadOnly: 0,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          arbeidsforhold: {
            arbeidsgiverIdent: '795349533',
            startdato: '2021-11-01',
            opphoersdato: '2022-02-28',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
          },
          andelsnr: 5,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
        {
          belopReadOnly: 0,
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          arbeidsforhold: {
            arbeidsgiverIdent: '123456789',
            startdato: '2021-11-01',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
          },
          andelsnr: 6,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
    },
    hjemmel: {
      kode: '-',
      kodeverk: 'BG_HJEMMEL',
    },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: {
      ytelsetype: 'OMP',
      skalAvviksvurdere: true,
    },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2021-11-17',
  },
];

export const vilkår = beregningsgrunnlag.map((bg, index) => ({
  vilkarType: "FP_VK_41",
  avslagKode: null,
  merknadParametere: {},
  vilkarStatus: 'IKKE_VURDERT',
  periode: {
    fom: bg.skjaeringstidspunktBeregning,
    tom: beregningsgrunnlag.length === index ? null : beregningsgrunnlag[index].skjaeringstidspunktBeregning,
  },
  begrunnelse: null,
  vurderesIBehandlingen: true,
}));

export const behandling = {
  id: 1,
  versjon: 1,
  type: 'BT-003',
  behandlingsresultat: {
    vilkårResultat: {
      BEREGNINGSGRUNNLAGVILKÅR: vilkår,
    },
  },
};
