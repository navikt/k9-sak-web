let mockAlleBehandlinger;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default mockAlleBehandlinger = [
  {
    avsluttet: '2021-02-08T14:50:30',
    behandlendeEnhetId: '4409',
    behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal',
    behandlingÅrsaker: [],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2021-03-22',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: {
        kode: 'INNVILGET',
        erHenleggelse: false,
        behandlingsresultatOpphørt: false,
        behandlingsresultatAvslått: false,
        behandlingsresultatHenlagt: false,
        behandlingsresultatAvslåttOrOpphørt: false,
        behandlingsresultatIkkeEndret: false,
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
        behandlingHenlagt: false,
      },
      vilkårResultat: {
        OPPTJENINGSVILKÅRET: [
          {
            periode: {
              fom: '2020-03-21',
              tom: '2020-03-22',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
          {
            periode: {
              fom: '2020-03-17',
              tom: '2020-03-19',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: {
              fom: '2020-03-21',
              tom: '2020-03-22',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
          {
            periode: {
              fom: '2020-03-17',
              tom: '2020-03-19',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: {
              fom: '2020-03-21',
              tom: '2020-03-22',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
          {
            periode: {
              fom: '2020-03-17',
              tom: '2020-03-19',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
        ],
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: {
              fom: '2020-03-17',
              tom: '2020-03-22',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
        ],
      },
      vedtaksdato: '2021-02-08',
    },
    behandlingResultatType: {
      kode: 'INNVILGET',
      erHenleggelse: false,
      behandlingsresultatOpphørt: false,
      behandlingsresultatAvslått: false,
      behandlingsresultatHenlagt: false,
      behandlingsresultatAvslåttOrOpphørt: false,
      behandlingsresultatIkkeEndret: false,
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      behandlingHenlagt: false,
    },
    endret: '2021-02-08T14:50:29.982',
    endretAvBrukernavn: 'im-just-a-fake-code',
    erPaaVent: false,
    fagsakId: 999951,
    gjeldendeVedtak: true,
    id: 999951,
    links: [
      {
        href: '/k9/sak/api/behandlinger/rettigheter?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'behandling-rettigheter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/medlemskap-v2?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'soeker-medlemskap-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/omsorg-for?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'omsorgen-for',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/aarskvantum/forbruktedager?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'forbrukte-dager',
        requestPayload: null,
        type: 'GET',
      },
      {
        href:
          '/k9/sak/api/behandling/aarskvantum/uttaksplan?saksnummer=5YC1S&behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'full-uttaksplan',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/fagsak?saksnummer=5YC1S',
        rel: 'fagsak',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/historikk?saksnummer=5YC1S',
        rel: 'historikk',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/aksjonspunkt-v2?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'aksjonspunkter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/vilkar-v3?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'vilkar-v3',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/soknad?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'soknad',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/personopplysninger?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'soeker-personopplysninger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/inntekt-arbeid-ytelse?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'inntekt-arbeid-ytelse',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/iay/arbeidsforhold-v2?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'arbeidsforhold-v1',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/arbeidsgiver?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'arbeidsgivere',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening-v2?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'opptjening-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening/inntekt?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'inntekt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/brev/vedtak?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'vedtak-varsel',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat/?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'beregningsresultat',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat/utbetalt?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'beregningsresultat-utbetalt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'beregningsgrunnlag',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/alle?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'beregningsgrunnlag-alle',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: 'http://localhost:9000/k9/oppdrag/api/simulering/detaljert-resultat',
        rel: 'simuleringResultat',
        requestPayload: '446d1fda-726a-4179-98a0-c26abe1c2529',
        type: 'POST',
      },
      {
        href: '/k9/formidling/api/brev/maler?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529&sakstype=OMP',
        rel: 'brev-maler',
        requestPayload: null,
        type: 'GET',
      },
      {
        href:
          '/k9/formidling/api/brev/tilgjengeligevedtaksbrev?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529&sakstype=OMP',
        rel: 'tilgjengelige-vedtaksbrev',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api?behandlingUuid=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'dokumentdata-hente',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api/446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'dokumentdata-lagre',
        requestPayload: null,
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/kontrollresultat/resultat?behandlingId=446d1fda-726a-4179-98a0-c26abe1c2529',
        rel: 'kontrollresultat',
        requestPayload: null,
        type: 'GET',
      },
    ],
    opprettet: '2021-02-08T14:49:51',
    originalVedtaksDato: '2021-02-08',
    sprakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    status: {
      kode: 'AVSLU',
      kodeverk: 'BEHANDLING_STATUS',
    },
    toTrinnsBehandling: false,
    type: {
      kode: 'BT-002',
      kodeverk: 'BEHANDLING_TYPE',
    },
    uuid: '446d1fda-726a-4179-98a0-c26abe1c2529',
    behandlingHenlagt: false,
    versjon: 71,
  },
];
