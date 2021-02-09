import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

let mockBehandlingsdata;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default mockBehandlingsdata = {
  aksjonspunkter: [
    {
      definisjon: { kode: aksjonspunktCodes.UTVIDET_RETT, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ],
  vilkar: [
    {
      vilkarType: {
        kode: 'FP_VK_2',
        kodeverk: 'VILKAR_TYPE',
      },
      lovReferanse: '§ 2',
      overstyrbar: false,
      perioder: [
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: {
            kode: 'OPPFYLT',
            kodeverk: 'VILKAR_UTFALL_TYPE',
          },
          periode: {
            fom: '2020-03-17',
            tom: '2020-03-22',
          },
          begrunnelse: null,
        },
      ],
    },
    {
      vilkarType: {
        kode: 'FP_VK_455',
        kodeverk: 'VILKAR_TYPE',
      },
      lovReferanse: '§ 8',
      overstyrbar: false,
      perioder: [
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: {
            kode: 'OPPFYLT',
            kodeverk: 'test',
          },
          periode: {
            fom: '2020-03-17',
            tom: '2020-03-19',
          },
          begrunnelse: null,
        },
        {
          avslagKode: null,
          merknadParametere: {},
          vilkarStatus: {
            kode: 'OPPFYLT',
            kodeverk: 'VILKAR_UTFALL_TYPE',
          },
          periode: {
            fom: '2020-03-21',
            tom: '2020-03-22',
          },
          begrunnelse: null,
        },
      ],
    },
  ],
  personopplysninger: {
    aktoerId: '9930518028614',
    diskresjonskode: {
      kode: 'UDEF',
      kodeverk: 'DISKRESJONSKODE',
    },
    fnr: '30518028614',
    adresser: [
      {
        adresselinje1: 'Fjordlandet 10 B',
        adresselinje2: null,
        adresselinje3: null,
        adresseType: {
          kode: 'BOSTEDSADRESSE',
          kodeverk: 'ADRESSE_TYPE',
        },
        land: 'NOR',
        mottakerNavn: 'Skravlepapegøye Gunnhild',
        postNummer: '2500',
        poststed: null,
      },
    ],
    annenPart: null,
    avklartPersonstatus: {
      orginalPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      overstyrtPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    barn: [
      {
        aktoerId: '9930482094089',
        diskresjonskode: {
          kode: 'UDEF',
          kodeverk: 'DISKRESJONSKODE',
        },
        fnr: '30482094089',
        adresser: [
          {
            adresselinje1: 'Fjordlandet 10 B',
            adresselinje2: null,
            adresselinje3: null,
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            land: 'NOR',
            mottakerNavn: 'Duck Dole',
            postNummer: '2500',
            poststed: null,
          },
        ],
        annenPart: null,
        avklartPersonstatus: {
          orginalPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
          overstyrtPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
        },
        barn: [],
        barnFraTpsRelatertTilSoknad: [],
        barnSoktFor: [],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '2021-02-02',
        harVerge: false,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        navn: 'Duck Dole',
        nummer: null,
        personstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        region: {
          kode: 'NORDEN',
          kodeverk: 'REGION',
        },
        sivilstand: {
          kode: 'UGIF',
          kodeverk: 'SIVILSTAND_TYPE',
        },
        statsborgerskap: {
          kode: 'NOR',
          navn: 'NOR',
          kodeverk: 'LANDKODER',
        },
      },
    ],
    barnFraTpsRelatertTilSoknad: [],
    barnSoktFor: [],
    dodsdato: null,
    ektefelle: {
      aktoerId: '9913459959631',
      diskresjonskode: {
        kode: 'UDEF',
        kodeverk: 'DISKRESJONSKODE',
      },
      fnr: '13459959631',
      adresser: [
        {
          adresselinje1: 'Fjordlandet 10 B',
          adresselinje2: null,
          adresselinje3: null,
          adresseType: {
            kode: 'BOSTEDSADRESSE',
            kodeverk: 'ADRESSE_TYPE',
          },
          land: 'NOR',
          mottakerNavn: 'Terrier Bernt',
          postNummer: '2500',
          poststed: null,
        },
      ],
      annenPart: null,
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
      barn: [],
      barnFraTpsRelatertTilSoknad: [],
      barnSoktFor: [],
      dodsdato: null,
      ektefelle: null,
      fodselsdato: '1971-02-04',
      harVerge: false,
      navBrukerKjonn: {
        kode: 'M',
        kodeverk: 'BRUKER_KJOENN',
      },
      navn: 'Terrier Bernt',
      nummer: null,
      personstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      region: {
        kode: 'NORDEN',
        kodeverk: 'REGION',
      },
      sivilstand: {
        kode: 'UGIF',
        kodeverk: 'SIVILSTAND_TYPE',
      },
      statsborgerskap: {
        kode: 'NOR',
        navn: 'NOR',
        kodeverk: 'LANDKODER',
      },
    },
    fodselsdato: '1971-02-04',
    harVerge: false,
    navBrukerKjonn: {
      kode: 'K',
      kodeverk: 'BRUKER_KJOENN',
    },
    navn: 'Skravlepapegøye Gunnhild',
    nummer: null,
    personstatus: {
      kode: 'BOSA',
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    region: {
      kode: 'NORDEN',
      kodeverk: 'REGION',
    },
    sivilstand: {
      kode: 'GIFT',
      kodeverk: 'SIVILSTAND_TYPE',
    },
    statsborgerskap: {
      kode: 'NOR',
      navn: 'NOR',
      kodeverk: 'LANDKODER',
    },
  },
  beregningsresultatUtbetaling: {
    opphoersdato: null,
    perioder: [
      {
        andeler: [
          {
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            aktørId: null,
            arbeidsforholdId: null,
            arbeidsgiver: {
              identifikator: '910909088',
              identifikatorGUI: '910909088',
              navn: 'BEDRIFT AS',
            },
            arbeidsforholdType: {
              kode: '-',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            arbeidsgiverNavn: 'BEDRIFT AS',
            arbeidsgiverOrgnr: '910909088',
            eksternArbeidsforholdId: null,
            refusjon: 0,
            sisteUtbetalingsdato: null,
            stillingsprosent: 0,
            tilSoker: 0,
            utbetalingsgrad: 100,
            uttak: [
              {
                periode: {
                  fom: '2020-03-17',
                  tom: '2020-03-19',
                },
                utbetalingsgrad: 100,
                utfall: 'INNVILGET',
              },
            ],
          },
        ],
        dagsats: 0,
        fom: '2020-03-17',
        tom: '2020-03-19',
      },
      {
        andeler: [
          {
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            aktørId: null,
            arbeidsforholdId: null,
            arbeidsgiver: {
              identifikator: '910909088',
              identifikatorGUI: '910909088',
              navn: 'BEDRIFT AS',
            },
            arbeidsforholdType: {
              kode: '-',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            arbeidsgiverNavn: 'BEDRIFT AS',
            arbeidsgiverOrgnr: '910909088',
            eksternArbeidsforholdId: null,
            refusjon: 0,
            sisteUtbetalingsdato: null,
            stillingsprosent: 0,
            tilSoker: 0,
            utbetalingsgrad: 100,
            uttak: [
              {
                periode: {
                  fom: '2020-03-21',
                  tom: '2020-03-22',
                },
                utbetalingsgrad: 100,
                utfall: 'INNVILGET',
              },
            ],
          },
        ],
        dagsats: 0,
        fom: '2020-03-21',
        tom: '2020-03-22',
      },
    ],
    utbetaltePerioder: [],
    skalHindreTilbaketrekk: false,
  },
  beregningsgrunnlag: [
    {
      skjaeringstidspunktBeregning: '2020-03-17',
      skjæringstidspunkt: '2020-03-17',
      aktivitetStatus: [
        {
          kode: 'AT',
          kodeverk: 'AKTIVITET_STATUS',
        },
      ],
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPeriodeFom: '2020-03-17',
          beregningsgrunnlagPeriodeTom: '9999-12-31',
          beregnetPrAar: 60000,
          bruttoPrAar: 60000,
          bruttoInkludertBortfaltNaturalytelsePrAar: 60000,
          avkortetPrAar: 60000,
          redusertPrAar: 0,
          periodeAarsaker: [],
          dagsats: 0,
          beregningsgrunnlagPrStatusOgAndel: [
            {
              dtoType: 'GENERELL',
              beregningsgrunnlagFom: '2019-12-01',
              beregningsgrunnlagTom: '2020-02-29',
              aktivitetStatus: {
                kode: 'AT',
                kodeverk: 'AKTIVITET_STATUS',
              },
              beregningsperiodeFom: '2019-12-01',
              beregningsperiodeTom: '2020-02-29',
              beregnetPrAar: 60000,
              bruttoPrAar: 60000,
              avkortetPrAar: 0,
              redusertPrAar: 0,
              andelsnr: 1,
              inntektskategori: {
                kode: 'ARBEIDSTAKER',
                kodeverk: 'INNTEKTSKATEGORI',
              },
              arbeidsforhold: {
                arbeidsgiverNavn: 'BEDRIFT AS',
                arbeidsgiverId: '910909088',
                arbeidsgiverIdent: '910909088',
                arbeidsgiverIdVisning: '910909088',
                startdato: '2020-01-01',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
                belopFraInntektsmeldingPrMnd: 5000,
              },
              fastsattAvSaksbehandler: false,
              lagtTilAvSaksbehandler: false,
              belopPrMndEtterAOrdningen: 5000,
              belopPrAarEtterAOrdningen: 60000,
              dagsats: 0,
              erTilkommetAndel: false,
              skalFastsetteGrunnlag: false,
            },
          ],
        },
      ],
      sammenligningsgrunnlag: {
        sammenligningsgrunnlagFom: '2019-03-01',
        sammenligningsgrunnlagTom: '2020-02-29',
        rapportertPrAar: 60000,
        avvikPromille: 0,
        avvikProsent: 0,
        sammenligningsgrunnlagType: {
          kode: 'SAMMENLIGNING_ATFL_SN',
          kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
        },
        differanseBeregnet: 0,
      },
      sammenligningsgrunnlagPrStatus: [
        {
          sammenligningsgrunnlagFom: '2019-03-01',
          sammenligningsgrunnlagTom: '2020-02-29',
          rapportertPrAar: 60000,
          avvikPromille: 0,
          avvikProsent: 0,
          sammenligningsgrunnlagType: {
            kode: 'SAMMENLIGNING_ATFL_SN',
            kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
          },
          differanseBeregnet: 0,
        },
      ],
      halvG: 49929,
      grunnbeløp: 99858,
      faktaOmBeregning: {
        avklarAktiviteter: {
          aktiviteterTomDatoMapping: [
            {
              tom: '2020-03-17',
              aktiviteter: [
                {
                  arbeidsgiverNavn: 'BEDRIFT AS',
                  arbeidsgiverId: '910909088',
                  fom: '2020-01-01',
                  tom: '9999-12-31',
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
              ],
            },
          ],
          skjæringstidspunkt: '2020-03-17',
        },
        andelerForFaktaOmBeregning: [
          {
            belopReadOnly: 5000,
            fastsattBelop: 5000,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            refusjonskrav: 5000,
            visningsnavn: 'BEDRIFT AS (910909088)',
            arbeidsforhold: {
              arbeidsgiverNavn: 'BEDRIFT AS',
              arbeidsgiverId: '910909088',
              arbeidsgiverIdent: '910909088',
              arbeidsgiverIdVisning: '910909088',
              startdato: '2020-01-01',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
              belopFraInntektsmeldingPrMnd: 5000,
            },
            andelsnr: 1,
            skalKunneEndreAktivitet: false,
            lagtTilAvSaksbehandler: false,
          },
        ],
      },
      hjemmel: {
        kode: 'F_9_8_8_28',
        kodeverk: 'BG_HJEMMEL',
      },
      faktaOmFordeling: {
        fordelBeregningsgrunnlag: {
          fordelBeregningsgrunnlagPerioder: [
            {
              fom: '2020-03-17',
              tom: '9999-12-31',
              fordelBeregningsgrunnlagAndeler: [
                {
                  andelsnr: 1,
                  arbeidsforhold: {
                    arbeidsgiverNavn: 'BEDRIFT AS',
                    arbeidsgiverId: '910909088',
                    arbeidsgiverIdent: '910909088',
                    arbeidsgiverIdVisning: '910909088',
                    startdato: '2020-01-01',
                    arbeidsforholdType: {
                      kode: 'ARBEID',
                      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                  },
                  inntektskategori: {
                    kode: 'ARBEIDSTAKER',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  aktivitetStatus: {
                    kode: 'AT',
                    kodeverk: 'AKTIVITET_STATUS',
                  },
                  kilde: {
                    kode: 'PROSESS_START',
                    kodeverk: 'ANDEL_KILDE',
                  },
                  lagtTilAvSaksbehandler: false,
                  fastsattAvSaksbehandler: false,
                  andelIArbeid: [0],
                  refusjonskravPrAar: 0,
                  belopFraInntektsmeldingPrAar: 60000,
                  refusjonskravFraInntektsmeldingPrAar: 60000,
                  nyttArbeidsforhold: false,
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
              ],
              harPeriodeAarsakGraderingEllerRefusjon: false,
              skalRedigereInntekt: false,
              skalPreutfyllesMedBeregningsgrunnlag: false,
              skalKunneEndreRefusjon: false,
            },
          ],
          arbeidsforholdTilFordeling: [],
        },
      },
      årsinntektVisningstall: 60000,
      dekningsgrad: 100,
      ytelsesspesifiktGrunnlag: {
        ytelsetype: 'OMP',
        skalAvviksvurdere: false,
      },
      erOverstyrtInntekt: false,
      vilkårsperiodeFom: '2020-03-17',
    },
    {
      skjaeringstidspunktBeregning: '2020-03-21',
      skjæringstidspunkt: '2020-03-21',
      aktivitetStatus: [
        {
          kode: 'AT',
          kodeverk: 'AKTIVITET_STATUS',
        },
      ],
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPeriodeFom: '2020-03-21',
          beregningsgrunnlagPeriodeTom: '9999-12-31',
          beregnetPrAar: 60000,
          bruttoPrAar: 60000,
          bruttoInkludertBortfaltNaturalytelsePrAar: 60000,
          avkortetPrAar: 60000,
          redusertPrAar: 0,
          periodeAarsaker: [],
          dagsats: 0,
          beregningsgrunnlagPrStatusOgAndel: [
            {
              dtoType: 'GENERELL',
              beregningsgrunnlagFom: '2019-12-01',
              beregningsgrunnlagTom: '2020-02-29',
              aktivitetStatus: {
                kode: 'AT',
                kodeverk: 'AKTIVITET_STATUS',
              },
              beregningsperiodeFom: '2019-12-01',
              beregningsperiodeTom: '2020-02-29',
              beregnetPrAar: 60000,
              bruttoPrAar: 60000,
              avkortetPrAar: 0,
              redusertPrAar: 0,
              andelsnr: 1,
              inntektskategori: {
                kode: 'ARBEIDSTAKER',
                kodeverk: 'INNTEKTSKATEGORI',
              },
              arbeidsforhold: {
                arbeidsgiverNavn: 'BEDRIFT AS',
                arbeidsgiverId: '910909088',
                arbeidsgiverIdent: '910909088',
                arbeidsgiverIdVisning: '910909088',
                startdato: '2020-01-01',
                arbeidsforholdType: {
                  kode: 'ARBEID',
                  kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                },
                belopFraInntektsmeldingPrMnd: 5000,
              },
              fastsattAvSaksbehandler: false,
              lagtTilAvSaksbehandler: false,
              belopPrMndEtterAOrdningen: 5000,
              belopPrAarEtterAOrdningen: 60000,
              dagsats: 0,
              erTilkommetAndel: false,
              skalFastsetteGrunnlag: false,
            },
          ],
        },
      ],
      sammenligningsgrunnlag: {
        sammenligningsgrunnlagFom: '2019-03-01',
        sammenligningsgrunnlagTom: '2020-02-29',
        rapportertPrAar: 60000,
        avvikPromille: 0,
        avvikProsent: 0,
        sammenligningsgrunnlagType: {
          kode: 'SAMMENLIGNING_ATFL_SN',
          kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
        },
        differanseBeregnet: 0,
      },
      sammenligningsgrunnlagPrStatus: [
        {
          sammenligningsgrunnlagFom: '2019-03-01',
          sammenligningsgrunnlagTom: '2020-02-29',
          rapportertPrAar: 60000,
          avvikPromille: 0,
          avvikProsent: 0,
          sammenligningsgrunnlagType: {
            kode: 'SAMMENLIGNING_ATFL_SN',
            kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
          },
          differanseBeregnet: 0,
        },
      ],
      halvG: 49929,
      grunnbeløp: 99858,
      faktaOmBeregning: {
        avklarAktiviteter: {
          aktiviteterTomDatoMapping: [
            {
              tom: '2020-03-21',
              aktiviteter: [
                {
                  arbeidsgiverNavn: 'BEDRIFT AS',
                  arbeidsgiverId: '910909088',
                  fom: '2020-01-01',
                  tom: '9999-12-31',
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
              ],
            },
          ],
          skjæringstidspunkt: '2020-03-21',
        },
        andelerForFaktaOmBeregning: [
          {
            belopReadOnly: 5000,
            fastsattBelop: 5000,
            inntektskategori: {
              kode: 'ARBEIDSTAKER',
              kodeverk: 'INNTEKTSKATEGORI',
            },
            aktivitetStatus: {
              kode: 'AT',
              kodeverk: 'AKTIVITET_STATUS',
            },
            refusjonskrav: 5000,
            visningsnavn: 'BEDRIFT AS (910909088)',
            arbeidsforhold: {
              arbeidsgiverNavn: 'BEDRIFT AS',
              arbeidsgiverId: '910909088',
              arbeidsgiverIdent: '910909088',
              arbeidsgiverIdVisning: '910909088',
              startdato: '2020-01-01',
              arbeidsforholdType: {
                kode: 'ARBEID',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
              },
              belopFraInntektsmeldingPrMnd: 5000,
            },
            andelsnr: 1,
            skalKunneEndreAktivitet: false,
            lagtTilAvSaksbehandler: false,
          },
        ],
      },
      hjemmel: {
        kode: 'F_9_8_8_28',
        kodeverk: 'BG_HJEMMEL',
      },
      faktaOmFordeling: {
        fordelBeregningsgrunnlag: {
          fordelBeregningsgrunnlagPerioder: [
            {
              fom: '2020-03-21',
              tom: '9999-12-31',
              fordelBeregningsgrunnlagAndeler: [
                {
                  andelsnr: 1,
                  arbeidsforhold: {
                    arbeidsgiverNavn: 'BEDRIFT AS',
                    arbeidsgiverId: '910909088',
                    arbeidsgiverIdent: '910909088',
                    arbeidsgiverIdVisning: '910909088',
                    startdato: '2020-01-01',
                    arbeidsforholdType: {
                      kode: 'ARBEID',
                      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                    },
                  },
                  inntektskategori: {
                    kode: 'ARBEIDSTAKER',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  aktivitetStatus: {
                    kode: 'AT',
                    kodeverk: 'AKTIVITET_STATUS',
                  },
                  kilde: {
                    kode: 'PROSESS_START',
                    kodeverk: 'ANDEL_KILDE',
                  },
                  lagtTilAvSaksbehandler: false,
                  fastsattAvSaksbehandler: false,
                  andelIArbeid: [0],
                  refusjonskravPrAar: 0,
                  belopFraInntektsmeldingPrAar: 60000,
                  refusjonskravFraInntektsmeldingPrAar: 60000,
                  nyttArbeidsforhold: false,
                  arbeidsforholdType: {
                    kode: 'ARBEID',
                    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                  },
                },
              ],
              harPeriodeAarsakGraderingEllerRefusjon: false,
              skalRedigereInntekt: false,
              skalPreutfyllesMedBeregningsgrunnlag: false,
              skalKunneEndreRefusjon: false,
            },
          ],
          arbeidsforholdTilFordeling: [],
        },
      },
      årsinntektVisningstall: 60000,
      dekningsgrad: 100,
      ytelsesspesifiktGrunnlag: {
        ytelsetype: 'OMP',
        skalAvviksvurdere: false,
      },
      erOverstyrtInntekt: false,
      vilkårsperiodeFom: '2020-03-21',
    },
  ],
  forbrukteDager: {
    totaltAntallDager: 20,
    antallKoronadager: 0,
    antallDagerArbeidsgiverDekker: 3,
    antallDagerInfotrygd: 0,
    forbrukteDager: 5,
    forbruktTid: 'PT37H30M',
    restdager: 12,
    restTid: 'PT90H',
    smitteverndager: 'PT0S',
    sisteUttaksplan: {
      saksnummer: '5YC1S',
      behandlingUUID: '5b883b76-405a-4024-b8ae-a319aa1ede31',
      innsendingstidspunkt: '2021-02-04T12:46:14.082012',
      aktiviteter: [
        {
          arbeidsforhold: {
            type: 'AT',
            organisasjonsnummer: '910909088',
            aktørId: null,
            arbeidsforholdId: null,
          },
          uttaksperioder: [
            {
              periode: '2020-03-17/2020-03-19',
              delvisFravær: null,
              utfall: 'INNVILGET',
              vurderteVilkår: {
                vilkår: {
                  NOK_DAGER: 'INNVILGET',
                  ARBEIDSFORHOLD: 'INNVILGET',
                  INNGANGSVILKÅR: 'INNVILGET',
                  OMSORGSVILKÅRET: 'INNVILGET',
                  ALDERSVILKÅR_SØKER: 'INNVILGET',
                },
              },
              hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__6', 'FTRL_9_6__1'],
              utbetalingsgrad: 100,
              periodetype: 'NY',
              mottattTidspunkt: '2021-02-05T12:26:41.527',
              nøkkeltall: {
                totaltAntallDager: 20,
                antallKoronadager: 0,
                antallDagerArbeidsgiverDekker: 3,
                antallDagerInfotrygd: 0,
                antallForbrukteDager: 3,
                restTid: 'PT105H',
                forbruktTid: 'PT22H30M',
                smittevernTid: 'PT0S',
                migrertData: false,
              },
            },
            {
              periode: '2020-03-21/2020-03-22',
              delvisFravær: null,
              utfall: 'INNVILGET',
              vurderteVilkår: {
                vilkår: {
                  NOK_DAGER: 'INNVILGET',
                  ARBEIDSFORHOLD: 'INNVILGET',
                  INNGANGSVILKÅR: 'INNVILGET',
                  OMSORGSVILKÅRET: 'INNVILGET',
                  ALDERSVILKÅR_SØKER: 'INNVILGET',
                },
              },
              hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__6', 'FTRL_9_6__1'],
              utbetalingsgrad: 100,
              periodetype: 'NY',
              mottattTidspunkt: '2021-02-05T12:26:41.527',
              nøkkeltall: {
                totaltAntallDager: 20,
                antallKoronadager: 0,
                antallDagerArbeidsgiverDekker: 3,
                antallDagerInfotrygd: 0,
                antallForbrukteDager: 5,
                restTid: 'PT90H',
                forbruktTid: 'PT37H30M',
                smittevernTid: 'PT0S',
                migrertData: false,
              },
            },
          ],
        },
      ],
      benyttetRammemelding: true,
      aktiv: true,
      bekreftet: 'SYSTEMBEKREFTET',
      aksjonspunkt: null,
      aksjonspunkter: [],
    },
    rammevedtak: [
      {
        type: 'OverføringFår',
        vedtatt: '2020-01-01',
        lengde: 'PT480H',
        gyldigFraOgMed: '2020-01-01',
        gyldigTilOgMed: '2022-02-04',
        avsender: '02099541043',
      },
    ],
    barna: [
      {
        personIdent: '30482094089',
        fødselsdato: '2021-02-02',
        dødsdato: null,
        harSammeBosted: true,
        barnType: 'VANLIG',
      },
    ],
  },
  soknad: undefined,
  simuleringResultat: undefined,
};
