let mockBehandlingsdata;
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// OBS Soknad er for kronisk syk
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default mockBehandlingsdata = {
  aksjonspunkter: [
    {
      aksjonspunktType: {
        kode: 'MANU',
        kodeverk: 'AKSJONSPUNKT_TYPE',
      },
      begrunnelse: 'en begrunnelse',
      besluttersBegrunnelse: 'en begrunnelse',
      definisjon: {
        kode: '9002',
        kodeverk: 'AKSJONSPUNKT_DEF',
      },
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: {
        kode: 'UTFO',
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: true,
      vilkarType: {
        kode: 'K9_VK_1',
        kodeverk: 'VILKAR_TYPE',
      },
      vurderPaNyttArsaker: [],
      venteårsak: {
        kode: '-',
        kodeverk: 'VENT_AARSAK',
      },
    },
    {
      aksjonspunktType: {
        kode: 'MANU',
        kodeverk: 'AKSJONSPUNKT_TYPE',
      },
      begrunnelse: 'har en god grunn',
      besluttersBegrunnelse: 'har en god grunn',
      definisjon: {
        kode: '9013',
        kodeverk: 'AKSJONSPUNKT_DEF',
      },
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: {
        kode: 'UTFO',
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: true,
      vilkarType: {
        kode: 'K9_VK_9_6',
        kodeverk: 'VILKAR_TYPE',
      },
      vurderPaNyttArsaker: [],
      venteårsak: {
        kode: '-',
        kodeverk: 'VENT_AARSAK',
      },
    },
    {
      aksjonspunktType: {
        kode: 'MANU',
        kodeverk: 'AKSJONSPUNKT_TYPE',
      },
      begrunnelse: 'jeg sender til beslutter',
      besluttersBegrunnelse: null,
      definisjon: {
        kode: '5015',
        kodeverk: 'AKSJONSPUNKT_DEF',
      },
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: {
        kode: 'UTFO',
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      toTrinnsBehandling: false,
      toTrinnsBehandlingGodkjent: null,
      vilkarType: null,
      vurderPaNyttArsaker: null,
      venteårsak: {
        kode: '-',
        kodeverk: 'VENT_AARSAK',
      },
    },
    {
      aksjonspunktType: {
        kode: 'MANU',
        kodeverk: 'AKSJONSPUNKT_TYPE',
      },
      begrunnelse: 'Det er vedtatt',
      besluttersBegrunnelse: null,
      definisjon: {
        kode: '5016',
        kodeverk: 'AKSJONSPUNKT_DEF',
      },
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: {
        kode: 'UTFO',
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      toTrinnsBehandling: false,
      toTrinnsBehandlingGodkjent: null,
      vilkarType: null,
      vurderPaNyttArsaker: null,
      venteårsak: {
        kode: '-',
        kodeverk: 'VENT_AARSAK',
      },
    },
  ],
  vilkar: [
    {
      vilkarType: {
        kode: 'K9_VK_1',
        kodeverk: 'VILKAR_TYPE',
      },
      lovReferanse: '§ 9-10',
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
            fom: '2021-01-19',
            tom: '2021-08-17',
          },
          begrunnelse: null,
        },
      ],
    },
    {
      vilkarType: {
        kode: 'K9_VK_9_6',
        kodeverk: 'VILKAR_TYPE',
      },
      lovReferanse: '§ 9-6 3. ledd',
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
            fom: '2021-01-19',
            tom: '2021-08-17',
          },
          begrunnelse: null,
        },
      ],
    },
    {
      vilkarType: {
        kode: 'K9_VK_3',
        kodeverk: 'VILKAR_TYPE',
      },
      lovReferanse: '§ 9-3 første ledd',
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
            fom: '2021-01-19',
            tom: '2021-08-17',
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
  soknad: {
    begrunnelseForSenInnsending: null,
    manglendeVedlegg: [],
    angittePersoner: [
      {
        navn: 'DUCK DOLE',
        fødselsdato: '2019-02-18',
        rolle: 'BARN',
        aktørId: '9907481888926',
        personIdent: '07481888926',
      },
    ],
    mottattDato: '2021-02-18',
    oppgittStartdato: '2021-02-18',
    oppgittTilknytning: null,
    soknadsdato: '2021-02-18',
    spraakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    tilleggsopplysninger: null,
    søknadsperiode: {
      fom: '2021-02-18',
      tom: '9999-12-31',
    },
  },
};
