// eslint-disable-next-line max-len
export const beregningsgrunnlag = [
  {
    avklaringsbehov: [{definisjon: { kode : '5058' }, status: { kode: 'OPPR'}}],
    skjaeringstidspunktBeregning: '2019-03-13',
    skjæringstidspunkt: '2019-03-13',
    aktivitetStatus: [{ kodeverk: 'AKTIVITET_STATUS', kode: 'AT' }],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2019-03-13',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            beregningsgrunnlagFom: '2018-12-01',
            beregningsgrunnlagTom: '2019-02-28',
            aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
            beregningsperiodeFom: '2018-12-01',
            beregningsperiodeTom: '2019-02-28',
            andelsnr: 1,
            inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
            arbeidsforhold: {
              arbeidsgiverId: '910909088',
              arbeidsgiverIdVisning: '910909088',
              startdato: '2013-08-28',
              opphoersdato: '2019-12-31',
              arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              belopFraInntektsmeldingPrMnd: 60833.0,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 49248.91,
            belopPrAarEtterAOrdningen: 590986.92,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=581298)',
    halvG: 48441.5,
    grunnbeløp: 96883.0,
    faktaOmBeregning: {
      faktaOmBeregningTilfeller: [
        { kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE', kode: 'VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT' },
      ],
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2019-03-13',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2013-08-28',
                tom: '2019-12-31',
                arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2019-03-13',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 60833.0,
          inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
          aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
          refusjonskrav: 60833.0,
          visningsnavn: 'BEDRIFTEN AS (910909088)',
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2013-08-28',
            opphoersdato: '2019-12-31',
            arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
            belopFraInntektsmeldingPrMnd: 60833.0,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: {},
      refusjonskravSomKommerForSentListe: [{ arbeidsgiverIdent: '910909088' }],
    },
    hjemmel: { kodeverk: 'BG_HJEMMEL', kode: '-' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2019-03-13',
  },
  {
    avklaringsbehov: [],
    skjaeringstidspunktBeregning: '2020-05-13',
    skjæringstidspunkt: '2020-05-13',
    aktivitetStatus: [{ kodeverk: 'AKTIVITET_STATUS', kode: 'AT' }],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-05-13',
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
            aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
            beregningsperiodeFom: '2020-02-01',
            beregningsperiodeTom: '2020-04-30',
            andelsnr: 1,
            inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
            arbeidsforhold: {
              arbeidsgiverIdent: '910909088',
              startdato: '2013-08-28',
              arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              belopFraInntektsmeldingPrMnd: 60833.0,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 60899.6866666667,
            belopPrAarEtterAOrdningen: 730796.24,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    halvG: 49929.0,
    grunnbeløp: 99858.0,
    faktaOmBeregning: {
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-05-13',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2020-01-01',
                tom: '9999-12-31',
                arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-05-13',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 60833.0,
          inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
          aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
          refusjonskrav: 60833.0,
          visningsnavn: 'BEDRIFTEN AS (910909088)',
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2013-08-28',
            arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
            belopFraInntektsmeldingPrMnd: 60833.0,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
    },
    hjemmel: { kodeverk: 'BG_HJEMMEL', kode: '-' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-05-13',
  },
  {
    avklaringsbehov: [],
    skjaeringstidspunktBeregning: '2020-06-12',
    skjæringstidspunkt: '2020-06-12',
    aktivitetStatus: [{ kodeverk: 'AKTIVITET_STATUS', kode: 'AT' }],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-06-12',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            beregningsgrunnlagFom: '2020-03-01',
            beregningsgrunnlagTom: '2020-05-31',
            aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
            beregningsperiodeFom: '2020-03-01',
            beregningsperiodeTom: '2020-05-31',
            andelsnr: 1,
            inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
            arbeidsforhold: {
              arbeidsgiverIdent: '910909088',
              startdato: '2013-08-28',
              arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              belopFraInntektsmeldingPrMnd: 60833.0,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 60938.0766666667,
            belopPrAarEtterAOrdningen: 731256.92,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    halvG: 49929.0,
    grunnbeløp: 99858.0,
    faktaOmBeregning: {
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-06-12',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2020-01-01',
                tom: '9999-12-31',
                arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-06-12',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 60833.0,
          inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
          aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
          refusjonskrav: 60833.0,
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2013-08-28',
            arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
            belopFraInntektsmeldingPrMnd: 60833.0,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
    },
    hjemmel: { kodeverk: 'BG_HJEMMEL', kode: '-' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-06-12',
  },
  {
    avklaringsbehov: [],
    skjaeringstidspunktBeregning: '2020-06-19',
    skjæringstidspunkt: '2020-06-19',
    aktivitetStatus: [{ kodeverk: 'AKTIVITET_STATUS', kode: 'AT' }],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-06-19',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            beregningsgrunnlagFom: '2020-03-01',
            beregningsgrunnlagTom: '2020-05-31',
            aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
            beregningsperiodeFom: '2020-03-01',
            beregningsperiodeTom: '2020-05-31',
            andelsnr: 1,
            inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
            arbeidsforhold: {
              arbeidsgiverIdent: '910909088',
              startdato: '2013-08-28',
              arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              belopFraInntektsmeldingPrMnd: 60833.0,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 60938.0766666667,
            belopPrAarEtterAOrdningen: 731256.92,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    halvG: 49929.0,
    grunnbeløp: 99858.0,
    faktaOmBeregning: {
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-06-19',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2020-01-01',
                tom: '9999-12-31',
                arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-06-19',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 60833.0,
          inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
          aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
          refusjonskrav: 60833.0,
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2013-08-28',
            arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
            belopFraInntektsmeldingPrMnd: 60833.0,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
    },
    hjemmel: { kodeverk: 'BG_HJEMMEL', kode: '-' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-06-19',
  },
  {
    avklaringsbehov: [],
    skjaeringstidspunktBeregning: '2020-06-25',
    skjæringstidspunkt: '2020-06-25',
    aktivitetStatus: [{ kodeverk: 'AKTIVITET_STATUS', kode: 'AT' }],
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPeriodeFom: '2020-06-25',
        beregningsgrunnlagPeriodeTom: '9999-12-31',
        beregnetPrAar: 0,
        bruttoPrAar: 0,
        bruttoInkludertBortfaltNaturalytelsePrAar: 0,
        periodeAarsaker: [],
        beregningsgrunnlagPrStatusOgAndel: [
          {
            dtoType: 'GENERELL',
            beregningsgrunnlagFom: '2020-03-01',
            beregningsgrunnlagTom: '2020-05-31',
            aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
            beregningsperiodeFom: '2020-03-01',
            beregningsperiodeTom: '2020-05-31',
            andelsnr: 1,
            inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
            arbeidsforhold: {
              arbeidsgiverIdent: '910909088',
              startdato: '2013-08-28',
              arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              belopFraInntektsmeldingPrMnd: 60833.0,
            },
            fastsattAvSaksbehandler: false,
            lagtTilAvSaksbehandler: false,
            belopPrMndEtterAOrdningen: 60938.0766666667,
            belopPrAarEtterAOrdningen: 731256.92,
            erTilkommetAndel: false,
            skalFastsetteGrunnlag: false,
          },
        ],
      },
    ],
    sammenligningsgrunnlagPrStatus: [],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    halvG: 49929.0,
    grunnbeløp: 99858.0,
    faktaOmBeregning: {
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [
          {
            tom: '2020-06-25',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2020-01-01',
                tom: '9999-12-31',
                arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
              },
            ],
          },
        ],
        skjæringstidspunkt: '2020-06-25',
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 60833.0,
          inntektskategori: { kodeverk: 'INNTEKTSKATEGORI', kode: 'ARBEIDSTAKER' },
          aktivitetStatus: { kodeverk: 'AKTIVITET_STATUS', kode: 'AT' },
          refusjonskrav: 60833.0,
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2013-08-28',
            arbeidsforholdType: { kodeverk: 'OPPTJENING_AKTIVITET_TYPE', kode: 'ARBEID' },
            belopFraInntektsmeldingPrMnd: 60833.0,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
    },
    hjemmel: { kodeverk: 'BG_HJEMMEL', kode: '-' },
    årsinntektVisningstall: 0,
    dekningsgrad: 100,
    ytelsesspesifiktGrunnlag: { ytelsetype: 'OMP', skalAvviksvurdere: true },
    erOverstyrtInntekt: false,
    vilkårsperiodeFom: '2020-06-25',
  },
];

export const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    vilkårResultat: {
      // eslint-disable-next-line max-len
      BEREGNINGSGRUNNLAGVILKÅR: [
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          periode: { fom: '2019-03-13', tom: '2020-03-19' },
          vurdersIBehandlingen: true,
          begrunnelse: null,
        },
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          periode: { fom: '2020-05-13', tom: '2020-05-14' },
          vurdersIBehandlingen: true,
          begrunnelse: null,
        },
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          periode: { fom: '2020-06-12', tom: '2020-06-12' },
          vurdersIBehandlingen: true,
          begrunnelse: null,
        },
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          periode: { fom: '2020-06-19', tom: '2020-06-23' },
          vurdersIBehandlingen: true,
          begrunnelse: null,
        },
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          periode: { fom: '2020-06-25', tom: '2020-06-26' },
          begrunnelse: null,
          vurdersIBehandlingen: true,
        },
      ],
    },
  },
};

