// eslint-disable-next-line max-len
export const beregningsgrunnlag = [
  {
    avklaringsbehov: [{ definisjon: { kode: '5058' }, status: { kode: 'UTFO' }, kanLoses: true }],
    skjaeringstidspunktBeregning: '2020-03-04',
    skjæringstidspunkt: '2020-03-04',
    aktivitetStatus: [{ kode: 'KUN_YTELSE', kodeverk: 'AKTIVITET_STATUS' }],
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
            aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
            andelsnr: 1,
            inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
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
            inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
            kilde: { kode: 'PROSESS_START', kodeverk: 'ANDEL_KILDE' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            fastsattBelopPrMnd: 10_000,
          },
        ],
        fodendeKvinneMedDP: false,
      },
      faktaOmBeregningTilfeller: [{ kode: 'FASTSETT_BG_KUN_YTELSE', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' }],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-03-04',
            aktiviteter: [
              {
                fom: '2019-11-18',
                tom: '2020-09-27',
                arbeidsforholdType: { kode: 'FORELDREPENGER', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
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
                arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-03-04',
      },
      andelerForFaktaOmBeregning: [
        {
          inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
          aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
          visningsnavn: 'Brukers andel',
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
    },
    hjemmel: { kode: '-', kodeverk: 'BG_HJEMMEL' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-03-04',
  },
  {
    avklaringsbehov: [{ definisjon: { kode: '5058' }, status: { kode: 'OPPR' } }],
    skjaeringstidspunktBeregning: '2020-06-04',
    skjæringstidspunkt: '2020-06-04',
    aktivitetStatus: [{ kode: 'KUN_YTELSE', kodeverk: 'AKTIVITET_STATUS' }],
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
            aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
            andelsnr: 1,
            inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
            fastsattAvSaksbehandler: true,
            lagtTilAvSaksbehandler: false,
            erTilkommetAndel: false,
            beregnetPrAar: null,
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
            inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
            kilde: { kode: 'PROSESS_START', kodeverk: 'ANDEL_KILDE' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
          },
        ],
        fodendeKvinneMedDP: false,
      },
      faktaOmBeregningTilfeller: [{ kode: 'FASTSETT_BG_KUN_YTELSE', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' }],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-06-04',
            aktiviteter: [
              {
                fom: '2019-11-18',
                tom: '2020-09-27',
                arbeidsforholdType: { kode: 'FORELDREPENGER', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
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
                arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-06-04',
      },
      andelerForFaktaOmBeregning: [
        {
          inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
          aktivitetStatus: { kode: 'BA', kodeverk: 'AKTIVITET_STATUS' },
          visningsnavn: 'Brukers andel',
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
    },
    hjemmel: { kode: '-', kodeverk: 'BG_HJEMMEL' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-06-04',
  },
];

const vilkår = [
  {
    vilkarType: { kode: 'FP_VK_41' },
    avslagKode: null,
    merknadParametere: {},
    vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    periode: {
      fom: beregningsgrunnlag[0].skjaeringstidspunktBeregning,
      tom: beregningsgrunnlag[0].skjaeringstidspunktBeregning,
    },
    begrunnelse: null,
    vurderesIBehandlingen: false,
  },
  {
    avslagKode: null,
    merknadParametere: {},
    vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    periode: {
      fom: beregningsgrunnlag[1].skjaeringstidspunktBeregning,
      tom: beregningsgrunnlag[1].skjaeringstidspunktBeregning,
    },
    begrunnelse: null,
    vurderesIBehandlingen: true,
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
