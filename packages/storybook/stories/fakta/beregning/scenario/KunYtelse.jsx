// eslint-disable-next-line max-len
export const beregningsgrunnlag = [
  {
    avklaringsbehov: [],
    skjaeringstidspunktBeregning: '2020-05-18',
    skjæringstidspunkt: '2020-05-18',
    aktivitetStatus: ['AT'],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-05-18',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            beregningsgrunnlagFom: '2020-02-01',
            beregningsgrunnlagTom: '2020-04-30',
            aktivitetStatus: 'AT',
            beregningsperiodeFom: '2020-02-01',
            beregningsperiodeTom: '2020-04-30',
            andelsnr: 1,
            inntektskategori: 'ARBEIDSTAKER',
            arbeidsforhold: {
              arbeidsgiverIdent: '123456789',
              startdato: '2017-11-01',
              opphoersdato: '2020-05-31',
              arbeidsforholdType: 'ARBEID',
              belopFraInntektsmeldingPrMnd: 81364.35,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 76001.8766666667,
            belopPrAarEtterAOrdningen: 912022.52,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    halvG: 50675.5,
    grunnbeløp: 101351.0,
    faktaOmBeregning: {
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-05-18',
            aktiviteter: [
              {
                arbeidsgiverIdent: '123456789',
                fom: '2017-11-01',
                tom: '2020-05-31',
                arbeidsforholdType: 'ARBEID',
              },
              {
                fom: '2019-11-18',
                tom: '2020-09-27',
                arbeidsforholdType: 'FORELDREPENGER',
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-05-18',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 81364.35,
          inntektskategori: 'ARBEIDSTAKER',
          aktivitetStatus: 'AT',
          refusjonskrav: 81364.35,
          arbeidsforhold: {
            arbeidsgiverIdent: '123456789',
            startdato: '2017-11-01',
            opphoersdato: '2020-05-31',
            arbeidsforholdType: 'ARBEID',
            belopFraInntektsmeldingPrMnd: 81364.35,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
    },
    hjemmel: '-',
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-05-18',
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
        beregnetPrAar: 0,
        bruttoPrAar: 0,
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
  vurdersIBehandlingen: true,
}));

export const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    vilkårResultat: {
      BEREGNINGSGRUNNLAGVILKÅR: vilkår,
    },
  },
};
