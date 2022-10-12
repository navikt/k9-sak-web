
export const bgUtenDelvisRefusjon = {
  avklaringsbehov: [
    {
      definisjon: '5059',
      status: 'OPPR',
      kanLoses: true
    }
  ],
  skjaeringstidspunktBeregning: '2020-05-15',
  vilkårsperiodeFom: '2020-05-15',
  dekningsgrad: null,
  grunnbeløp: null,
  erOverstyrtInntekt: null,
  skjæringstidspunkt: '2020-05-15',
  beregningsgrunnlagPeriode: [],
  refusjonTilVurdering: {
    andeler: [
      {
        aktivitetStatus: 'AT',
        tidligereUtbetalinger: [
          {
            fom: '2020-05-15',
            tom: '9999-12-31',
            erTildeltRefusjon: false,
          },
        ],
        nyttRefusjonskravFom: '2020-06-01',
        tidligsteMuligeRefusjonsdato: '2020-06-01',
        skalKunneFastsetteDelvisRefusjon: false,
        arbeidsgiver: {
          arbeidsgiverAktørId: '12345678',
        },
      },
    ],
  },
};

export const bgMedDelvisRefusjon = {
  avklaringsbehov: [
    {
      definisjon: '5059',
      status: 'OPPR',
    }
  ],
  skjaeringstidspunktBeregning: '2020-06-01',
  vilkårsperiodeFom: '2020-06-01',
  skjæringstidspunkt: '2020-06-01',
  dekningsgrad: null,
  grunnbeløp: null,
  erOverstyrtInntekt: null,
  beregningsgrunnlagPeriode: [],
  refusjonTilVurdering: {
    andeler: [
      {
        aktivitetStatus: 'AKTIVITET_STATUS',
        tidligereUtbetalinger: [
          {
            fom: '2020-05-15',
            tom: '9999-12-31',
            erTildeltRefusjon: true,
          },
        ],
        nyttRefusjonskravFom: '2020-06-01',
        tidligsteMuligeRefusjonsdato: '2020-06-01',
        skalKunneFastsetteDelvisRefusjon: true,
        maksTillattDelvisRefusjonPrMnd: 12000,
        arbeidsgiver: {
          arbeidsgiverOrgnr: '12345679',
        },
      },
    ],
  },
};

export const aksjonspunkt = [
  {
    definisjon: '5059',
    status: 'OPPR',
    toTrinnsBehandling: true,
    aksjonspunktType: 'MANU',
    kanLoses: true,
    erAktivt: true,
  }];
