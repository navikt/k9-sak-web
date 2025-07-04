export const navAnsatt = {
  brukernavn: 'S123456',
  navn: null,
  kanSaksbehandle: true,
  kanVeilede: false,
  kanBeslutte: false,
  kanOverstyre: false,
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  funksjonellTid: '2025-07-03T13:40:32.480169084',
  skalViseDetaljerteFeilmeldinger: true,
};

export const sakBruker = {
  alder: 19,
  diskresjonskode: null,
  dodsdato: null,
  navn: 'SPEKKHOGGER SIGRUN',
  personnummer: '14478122870',
  aktørId: '9914478122870',
};

export const fetchFagsak = {
  saksnummer: '5YCCV',
  sakstype: 'UNG',
  gyldigPeriode: {
    fom: '2025-03-14',
    tom: '2026-03-12',
  },
  status: {
    kode: 'LOP',
    kodeverk: 'FAGSAK_STATUS',
  },
  kanRevurderingOpprettes: true,
  opprettet: '2025-07-04T13:38:07.268',
  endret: '2025-07-04T13:38:19.398',
  person: {
    alder: 19,
    diskresjonskode: null,
    dodsdato: null,
    navn: 'SPEKKHOGGER SIGRUN',
    personnummer: '14478122870',
    aktørId: '9914478122870',
  },
};

export const sakRettigheter = {
  behandlingTypeKanOpprettes: [
    { behandlingType: { kode: 'BT-004', kodeverk: 'BEHANDLING_TYPE' }, kanOppretteBehandling: false },
    { behandlingType: { kode: 'BT-002', kodeverk: 'BEHANDLING_TYPE' }, kanOppretteBehandling: false },
  ],
  behandlingTillatteOperasjoner: [],
};

export const behandlingerUngsak = [
  {
    visningsnavn: 'Kontroll av inntekt',
    avsluttet: '2025-07-04T13:38:19',
    behandlendeEnhetId: '4409',
    behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal',
    behandlingÅrsaker: [
      {
        erAutomatiskRevurdering: false,
        behandlingArsakType: { kode: 'RE-KONTROLL-REGISTER-INNTEKT', kodeverk: 'BEHANDLING_AARSAK' },
        manueltOpprettet: false,
      },
    ],
    behandlingKøet: false,
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingPåVent: false,
    behandlingsfristTid: '2025-08-15',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
      vilkårResultat: {
        UNG_VK_1: [
          {
            periode: { fom: '2025-03-14', tom: '2026-03-12' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        UNG_VK_2: [
          {
            periode: { fom: '2025-03-14', tom: '2026-03-12' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
      },
      vedtaksdato: '2025-07-04',
    },
    behandlingResultatType: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
    endret: '2025-07-04T13:38:19.392',
    endretAvBrukernavn: 'vtp',
    erPåVent: false,
    erPaaVent: false,
    fagsakId: 2000007,
    sakstype: { kode: 'UNG', kodeverk: 'FAGSAK_YTELSE' },
    førsteÅrsak: {
      erAutomatiskRevurdering: false,
      behandlingArsakType: { kode: 'RE-KONTROLL-REGISTER-INNTEKT', kodeverk: 'BEHANDLING_AARSAK' },
      manueltOpprettet: false,
    },
    fristBehandlingPaaVent: null,
    gjeldendeVedtak: true,
    id: 3000015,
    links: [],
    opprettet: '2025-07-04T13:38:08',
    originalVedtaksDato: '2025-07-04',
    sprakkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    språkkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    status: { kode: 'AVSLU', kodeverk: 'BEHANDLING_STATUS' },
    toTrinnsBehandling: false,
    type: { kode: 'BT-004', kodeverk: 'BEHANDLING_TYPE' },
    uuid: '504f4e5e-c356-4203-8590-5749cde1d61b',
    venteArsakKode: null,
    behandlingHenlagt: false,
    versjon: 36,
  },
  {
    visningsnavn: 'Kontroll av inntekt',
    avsluttet: '2025-07-04T13:38:08',
    behandlendeEnhetId: '4409',
    behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal',
    behandlingÅrsaker: [],
    behandlingKøet: false,
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingPåVent: false,
    behandlingsfristTid: '2025-08-15',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
      vilkårResultat: {
        UNG_VK_1: [
          {
            periode: { fom: '2025-03-14', tom: '2026-03-12' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        UNG_VK_2: [
          {
            periode: { fom: '2025-03-14', tom: '2026-03-12' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
      },
      vedtaksdato: '2025-07-04',
    },
    behandlingResultatType: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
    endret: '2025-07-04T13:38:08.108',
    endretAvBrukernavn: 'vtp',
    erPåVent: false,
    erPaaVent: false,
    fagsakId: 2000007,
    sakstype: { kode: 'UNG', kodeverk: 'FAGSAK_YTELSE' },
    fristBehandlingPaaVent: null,
    gjeldendeVedtak: false,
    id: 3000014,
    links: [],
    opprettet: '2025-07-04T13:38:07',
    originalVedtaksDato: '2025-07-04',
    sprakkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    språkkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    status: { kode: 'AVSLU', kodeverk: 'BEHANDLING_STATUS' },
    toTrinnsBehandling: false,
    type: { kode: 'BT-002', kodeverk: 'BEHANDLING_TYPE' },
    uuid: '4cb3c38c-fe49-4548-84c5-b31687089e12',
    venteArsakKode: null,
    behandlingHenlagt: false,
    versjon: 19,
  },
];

export const behandlendeEnheter = [
  { enhetId: '1900', enhetNavn: 'NAV Troms', status: null },
  { enhetId: '1001', enhetNavn: 'NAV Kristiansand', status: null },
  { enhetId: '2103', enhetNavn: 'NAV Viken', status: null },
  { enhetId: '4409', enhetNavn: 'NAV Arbeid og ytelser Arendal', status: null },
];

export const behandlingPersonopplysninger = {
  aktoerId: '9914478122870',
  diskresjonskode: { kode: 'UDEF', kodeverk: 'DISKRESJONSKODE' },
  fnr: '14478122870',
  dodsdato: null,
  ektefelle: null,
  fodselsdato: '2006-07-04',
  harVerge: false,
  navBrukerKjonn: { kode: '-', kodeverk: 'BRUKER_KJOENN' },
  navn: 'Spekkhogger Sigrun',
  nummer: null,
};

export const behandlingRettigheter = {
  behandlingTypeKanOpprettes: [
    { behandlingType: { kode: 'BT-004', kodeverk: 'BEHANDLING_TYPE' }, kanOppretteBehandling: true },
    { behandlingType: { kode: 'BT-002', kodeverk: 'BEHANDLING_TYPE' }, kanOppretteBehandling: false },
  ],
  behandlingTillatteOperasjoner: [],
};

export const aksjonspunkter = [
  {
    aksjonspunktType: { kode: 'AUTO', kodeverk: 'AKSJONSPUNKT_TYPE' },
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: { kode: '7040', kodeverk: 'AKSJONSPUNKT_DEF' },
    erAktivt: true,
    fristTid: '2025-07-18T13:38:15.441',
    kanLoses: false,
    status: { kode: 'UTFO', kodeverk: 'AKSJONSPUNKT_STATUS' },
    toTrinnsBehandling: false,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
    venteårsak: { kode: 'VENTER_ETTERLYS_INNTEKT_UTTALELSE', kodeverk: 'VENT_AARSAK' },
    venteårsakVariant: null,
    opprettetAv: 'vtp',
  },
];

export const vilkår = [
  {
    vilkarType: { kode: 'UNG_VK_1', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: 'Forskrift om forsøk med ungdomsprogram og ungdomsprogramytelse § 8 jamfør 3 bokstav a',
    overstyrbar: false,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2025-03-14', tom: '2026-03-12' },
        begrunnelse: null,
        vurderesIBehandlingen: true,
        merknad: { kode: '-', kodeverk: 'VILKAR_UTFALL_MERKNAD' },
      },
    ],
  },
  {
    vilkarType: { kode: 'UNG_VK_2', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: 'Forskrift om forsøk med ungdomsprogram og ungdomsprogramytelse § 8',
    overstyrbar: false,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2025-03-14', tom: '2026-03-12' },
        begrunnelse: null,
        vurderesIBehandlingen: true,
        merknad: { kode: '-', kodeverk: 'VILKAR_UTFALL_MERKNAD' },
      },
    ],
  },
];

export const kontrollerInntekt = {
  kontrollperioder: [
    {
      periode: { fom: '2025-04-01', tom: '2025-04-30' },
      status: 'INGEN_AVVIK',
      erTilVurdering: true,
      rapporterteInntekter: {
        bruker: { arbeidsinntekt: 10000, ytelse: null },
        register: {
          oppsummertRegister: { arbeidsinntekt: 10000, ytelse: null },
          inntekter: [{ arbeidsgiverIdentifikator: '111111111', ytelseType: null, inntekt: 10000 }],
        },
      },
      fastsattInntekt: 10000,
      begrunnelse: null,
      valg: 'BRUK_BRUKERS_INNTEKT',
      uttalelseFraBruker: null,
    },
    {
      periode: { fom: '2025-05-01', tom: '2025-05-31' },
      status: 'INGEN_AVVIK',
      erTilVurdering: true,
      rapporterteInntekter: {
        bruker: { arbeidsinntekt: 10000, ytelse: null },
        register: {
          oppsummertRegister: { arbeidsinntekt: 10000, ytelse: null },
          inntekter: [{ arbeidsgiverIdentifikator: '111111111', ytelseType: null, inntekt: 10000 }],
        },
      },
      fastsattInntekt: 10000,
      begrunnelse: null,
      valg: 'BRUK_BRUKERS_INNTEKT',
      uttalelseFraBruker: null,
    },
  ],
};

export const perioderMedVilkår = {
  perioderMedÅrsak: {
    perioderTilVurdering: [
      { fom: '2025-05-01', tom: '2025-05-31' },
      { fom: '2025-04-01', tom: '2025-04-30' },
      { fom: '2025-03-14', tom: '2025-03-31' },
      { fom: '2025-06-01', tom: '9999-12-31' },
    ],
    perioderMedÅrsak: [
      { periode: { fom: '2025-03-14', tom: '2025-03-31' }, årsaker: ['FØRSTEGANGSVURDERING'] },
      { periode: { fom: '2025-04-01', tom: '2025-04-30' }, årsaker: ['KONTROLL_AV_INNTEKT', 'FØRSTEGANGSVURDERING'] },
      { periode: { fom: '2025-05-01', tom: '2025-05-31' }, årsaker: ['KONTROLL_AV_INNTEKT', 'FØRSTEGANGSVURDERING'] },
      { periode: { fom: '2025-06-01', tom: '9999-12-31' }, årsaker: ['FØRSTEGANGSVURDERING'] },
    ],
    årsakMedPerioder: [],
    dokumenterTilBehandling: [
      {
        journalpostId: '72141515',
        innsendingsTidspunkt: '2025-07-04T11:38:06.216',
        søktePerioder: [{ periode: { fom: '2025-03-14', tom: '9999-12-31' } }],
        type: 'SØKNAD',
      },
    ],
  },
  periodeMedUtfall: [{ periode: { fom: '2025-03-14', tom: '2026-03-12' }, utfall: 'IKKE_VURDERT' }],
  forrigeVedtak: [],
};

export const ungdomsprogramInformasjon = {
  startdato: '2025-01-01',
  maksdatoForDeltakelse: '2025-12-30',
  opphørsdato: null,
  antallDagerTidligereUtbetalt: 23,
};

export const historyUngsak = [
  {
    historikkinnslagUuid: 'cf423709-432c-492a-86e4-30a177332a32',
    behandlingUuid: 'daa1a828-9f8d-466d-b051-93e06931129f',
    aktør: { type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' }, ident: null },
    skjermlenke: { kode: 'VEDTAK', kodeverk: 'SKJERMLENKE_TYPE' },
    opprettetTidspunkt: '2025-07-03T14:52:49.123922',
    dokumenter: [],
    tittel: null,
    linjer: [{ type: 'TEKST', tekst: 'Vedtak er fattet: Innvilget.' }],
  },
  {
    historikkinnslagUuid: '21549099-0de6-4a23-a358-9046de79a401',
    behandlingUuid: '53b65a69-fdcb-4e27-a1fb-830c889f5cce',
    aktør: { type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' }, ident: null },
    skjermlenke: null,
    opprettetTidspunkt: '2025-07-03T14:52:49.278561',
    dokumenter: [],
    tittel: 'Revurdering opprettet',
    linjer: [{ type: 'TEKST', tekst: 'Kontroll av registerinntekt.' }],
  },
  {
    historikkinnslagUuid: '7b4ee07e-d45a-45b0-bb70-0fc8e3798a6e',
    behandlingUuid: 'daa1a828-9f8d-466d-b051-93e06931129f',
    aktør: { type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' }, ident: null },
    skjermlenke: null,
    opprettetTidspunkt: '2025-07-03T14:52:50.160734',
    dokumenter: [
      {
        dokumentId: '72141514',
        journalpostId: '72141514',
        tag: 'Brev',
        url: 'http://172.30.0.9:8901/ung/sak/api/dokument/hent-dokument?journalpostId=72141514&dokumentId=72141514',
        utgått: false,
      },
    ],
    tittel: 'Vedtaksbrev bestilt',
    linjer: [{ type: 'TEKST', tekst: 'Førstegangsinnvilgelse.' }],
  },
  {
    historikkinnslagUuid: '938957c4-3b92-40f0-b5b6-41d31f737c7c',
    behandlingUuid: '53b65a69-fdcb-4e27-a1fb-830c889f5cce',
    aktør: { type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' }, ident: null },
    skjermlenke: null,
    opprettetTidspunkt: '2025-07-03T14:52:50.243278',
    dokumenter: [],
    tittel: 'Behandlingen er satt på vent til 17.07.2025',
    linjer: [{ type: 'TEKST', tekst: 'Venter på uttalelse fra bruker etter etterlysning.' }],
  },
];

export const simuleringResultat = {
  simuleringResultat: {
    periode: { fom: '2025-04-01', tom: '2025-05-31' },
    sumEtterbetaling: 16060,
    sumFeilutbetaling: 0,
    sumInntrekk: 0,
    ingenPerioderMedAvvik: false,
    perioderPerMottaker: [
      {
        mottakerType: 'BRUKER',
        resultatPerFagområde: [
          {
            fagOmrådeKode: 'UNG',
            rader: [
              {
                feltnavn: 'nyttBeløp',
                resultaterPerMåned: [
                  { periode: { fom: '2025-04-01', tom: '2025-04-30' }, beløp: 7678 },
                  { periode: { fom: '2025-05-01', tom: '2025-05-31' }, beløp: 8382 },
                ],
              },
            ],
          },
        ],
        resultatOgMotregningRader: [
          {
            feltnavn: 'inntrekkNesteMåned',
            resultaterPerMåned: [
              { periode: { fom: '2025-04-01', tom: '2025-04-30' }, beløp: 0 },
              { periode: { fom: '2025-05-01', tom: '2025-05-31' }, beløp: 0 },
            ],
          },
          {
            feltnavn: 'resultat',
            resultaterPerMåned: [
              { periode: { fom: '2025-04-01', tom: '2025-04-30' }, beløp: 7678 },
              { periode: { fom: '2025-05-01', tom: '2025-05-31' }, beløp: 8382 },
            ],
          },
        ],
        nesteUtbPeriode: { fom: '2025-08-01', tom: '2025-08-31' },
      },
    ],
  },
  slåttAvInntrekk: false,
};

export const tilbakekrevingvalg = {
  videreBehandling: {
    kode: '',
  },
};

export const månedsvisSatsOgUtbetaling = [
  {
    måned: '2025-03',
    satsperioder: [
      {
        fom: '2025-03-14',
        tom: '2025-03-31',
        dagsats: 649.08,
        grunnbeløpFaktor: 1.3607,
        grunnbeløp: 124028.0,
        satsType: 'LAV',
        antallBarn: 0,
        dagsatsBarnetillegg: 0,
        antallDager: 12,
      },
    ],
    antallDager: 12,
    reduksjon: 0.0,
    utbetaling: 7788.96,
    status: 'UTBETALT',
  },
  {
    måned: '2025-04',
    satsperioder: [
      {
        fom: '2025-04-01',
        tom: '2025-04-30',
        dagsats: 649.08,
        grunnbeløpFaktor: 1.3607,
        grunnbeløp: 124028.0,
        satsType: 'LAV',
        antallBarn: 0,
        dagsatsBarnetillegg: 0,
        antallDager: 22,
      },
    ],
    antallDager: 22,
    rapportertInntekt: 10000.0,
    reduksjon: 6600.0,
    utbetaling: 7679.76,
    status: 'UTBETALT',
  },
  {
    måned: '2025-05',
    satsperioder: [
      {
        fom: '2025-05-01',
        tom: '2025-05-31',
        dagsats: 681.17,
        grunnbeløpFaktor: 1.3607,
        grunnbeløp: 130160.0,
        satsType: 'LAV',
        antallBarn: 0,
        dagsatsBarnetillegg: 0,
        antallDager: 22,
      },
    ],
    antallDager: 22,
    rapportertInntekt: 10000.0,
    reduksjon: 6600.0,
    utbetaling: 8385.74,
    status: 'UTBETALT',
  },
];

export const allDocuments = [
  {
    behandlinger: [3000015],
    dokumentId: '72141518',
    gjelderFor: null,
    journalpostId: '72141518',
    kommunikasjonsretning: 'U',
    tidspunkt: '2025-07-04T13:38:19',
    tittel: 'Ungdomsytelse Endring',
    href: '/ung/sak/api/dokument/hent-dokument?saksnummer=5YCCV&journalpostId=72141518&dokumentId=72141518',
    brevkode: 'ENDRING',
  },
  {
    behandlinger: [3000015],
    dokumentId: '72141517',
    gjelderFor: null,
    journalpostId: '72141517',
    kommunikasjonsretning: 'I',
    tidspunkt: '2025-07-04T13:38:15',
    tittel: 'tittel',
    href: '/ung/sak/api/dokument/hent-dokument?saksnummer=5YCCV&journalpostId=72141517&dokumentId=72141517',
    brevkode: 'NAV 76-13.93',
  },
  {
    behandlinger: [3000014],
    dokumentId: '72141516',
    gjelderFor: null,
    journalpostId: '72141516',
    kommunikasjonsretning: 'U',
    tidspunkt: '2025-07-04T13:38:09',
    tittel: 'Ungdomsytelse Innvilgelse',
    href: '/ung/sak/api/dokument/hent-dokument?saksnummer=5YCCV&journalpostId=72141516&dokumentId=72141516',
    brevkode: 'INNVILGELSE',
  },
  {
    behandlinger: [3000014],
    dokumentId: '72141515',
    gjelderFor: null,
    journalpostId: '72141515',
    kommunikasjonsretning: 'I',
    tidspunkt: '2025-07-04T13:38:06',
    tittel: 'tittel',
    href: '/ung/sak/api/dokument/hent-dokument?saksnummer=5YCCV&journalpostId=72141515&dokumentId=72141515',
    brevkode: 'NAV 76-13.92',
  },
];
