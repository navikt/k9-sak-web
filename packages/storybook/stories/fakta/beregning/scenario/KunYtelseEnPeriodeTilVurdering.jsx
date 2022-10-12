// eslint-disable-next-line max-len
export const beregningsgrunnlag = [
  {
    avklaringsbehov: [{ definisjon: '5058', status: 'UTFO', kanLoses: true }],
    skjaeringstidspunktBeregning: '2020-03-04',
    skjæringstidspunkt: '2020-03-04',
    aktivitetStatus: ['KUN_YTELSE'],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-03-04',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 120_000,
        bruttoPrAar: 120_000,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            aktivitetStatus: 'BA',
            andelsnr: 1,
            inntektskategori: '-',
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            beregnetPrAar: 120_000,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    halvG: 50675.5,
    grunnbeløp: 101351.0,
    faktaOmBeregning: {
      kunYtelse: {
        andeler: [
          {
            andelsnr: 1,
            inntektskategori: '-',
            aktivitetStatus: 'BA',
            kilde: 'PROSESS_START',
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            fastsattBelopPrMnd: 10_000,
          },
        ],
        fodendeKvinneMedDP: false,
      },
      faktaOmBeregningTilfeller: ['FASTSETT_BG_KUN_YTELSE'],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-03-04',
            aktiviteter: [
              {
                fom: '2019-11-18',
                tom: '2020-09-27',
                arbeidsforholdType: 'FORELDREPENGER',
              },
            ],
          },
          {
            tom: '2020-03-01',
            aktiviteter: [
              {
                arbeidsgiverIdent: '123456789',
                fom: '2017-11-01',
                tom: '2020-05-31',
                arbeidsforholdType: 'ARBEID',
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-03-04',
      },
      andelerForFaktaOmBeregning: [
        {
          inntektskategori: '-',
          aktivitetStatus: 'BA',
          visningsnavn: 'Brukers andel',
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
    },
    hjemmel: '-',
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-03-04',
  },
  {
    avklaringsbehov: [{ definisjon: '5058', status: 'OPPR' }],
    skjaeringstidspunktBeregning: '2020-06-04',
    skjæringstidspunkt: '2020-06-04',
    aktivitetStatus: ['KUN_YTELSE'],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-06-04',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: null,
        bruttoPrAar: null,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            aktivitetStatus: 'BA',
            andelsnr: 1,
            inntektskategori: '-',
            fastsattAvSaksbehandler: true,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            beregnetPrAar: null
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    halvG: 50675.5,
    grunnbeløp: 101351.0,
    faktaOmBeregning: {
      kunYtelse: {
        andeler: [
          {
            andelsnr: 1,
            inntektskategori: '-',
            aktivitetStatus: 'BA',
            kilde: 'PROSESS_START',
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
          },
        ],
        fodendeKvinneMedDP: false,
      },
      faktaOmBeregningTilfeller: ['FASTSETT_BG_KUN_YTELSE'],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-06-04',
            aktiviteter: [
              {
                fom: '2019-11-18',
                tom: '2020-09-27',
                arbeidsforholdType: 'FORELDREPENGER',
              },
            ],
          },
          {
            tom: '2020-06-01',
            aktiviteter: [
              {
                arbeidsgiverIdent: '123456789',
                fom: '2017-11-01',
                tom: '2020-05-31',
                arbeidsforholdType: 'ARBEID',
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-06-04',
      },
      andelerForFaktaOmBeregning: [
        {
          inntektskategori: '-',
          aktivitetStatus: 'BA',
          visningsnavn: 'Brukers andel',
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
    },
    hjemmel: '-',
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-06-04',
  },
];

const vilkår = [{
  vilkarType: "FP_VK_41",
  avslagKode: null,
  merknadParametere: {},
  vilkarStatus: 'IKKE_VURDERT',
  periode: {
    fom: beregningsgrunnlag[0].skjaeringstidspunktBeregning,
    tom: beregningsgrunnlag[0].skjaeringstidspunktBeregning,
  },
  begrunnelse: null,
  vurdersIBehandlingen: false,
},
{
  avslagKode: null,
  merknadParametere: {},
  vilkarStatus: 'IKKE_VURDERT',
  periode: {
    fom: beregningsgrunnlag[1].skjaeringstidspunktBeregning,
    tom: beregningsgrunnlag[1].skjaeringstidspunktBeregning,
  },
  begrunnelse: null,
  vurdersIBehandlingen: true,
},
];

export const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    vilkårResultat: {
      BEREGNINGSGRUNNLAGVILKÅR: vilkår,
    },
  },
};
