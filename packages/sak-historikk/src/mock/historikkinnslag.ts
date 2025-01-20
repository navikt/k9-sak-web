export const behandlingStartet = {
  behandlingId: 1,
  type: {
    kode: 'BEH_STARTET',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'SOKER',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: 'K',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'Srvengangsstonad',
  opprettetTidspunkt: '2019-09-18T13:12:48.874',
  dokumentLinks: [
    {
      tag: 'Søknad',
      url: 'http://127.0.0.1:8080/fpsak/api/dokument/hent-dokument?journalpostId=2&dokumentId=3',
      journalpostId: '2',
      dokumentId: '3',
      utgått: false,
    },
  ],
  historikkinnslagDeler: [
    {
      begrunnelse: null,
      begrunnelseFritekst: null,
      hendelse: {
        navn: {
          kode: 'BEH_STARTET',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
};

export const innsynOpprettet = {
  behandlingId: null,
  type: {
    kode: 'INNSYN_OPPR',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'SBH',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: '-',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'S123456',
  opprettetTidspunkt: '2019-09-18T15:25:31.291',
  dokumentLinks: [],
  historikkinnslagDeler: [
    {
      begrunnelse: null,
      begrunnelseFritekst: 'Krav om innsyn mottatt 18.09.2019',
      hendelse: {
        navn: {
          kode: 'INNSYN_OPPR',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
};

export const nyeRegisteropplysninger = {
  behandlingId: 999951,
  type: {
    kode: 'NYE_REGOPPLYSNINGER',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'VL',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: '-',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'Srvengangsstonad',
  opprettetTidspunkt: '2019-09-19T12:16:14.499',
  dokumentLinks: [],
  historikkinnslagDeler: [
    {
      begrunnelse: {
        kode: 'SAKSBEH_START_PA_NYTT',
        kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      },
      begrunnelseFritekst: null,
      hendelse: {
        navn: {
          kode: 'NYE_REGOPPLYSNINGER',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
};

export const overlappendeSak = {
  aktoer: {
    kode: 'SBH',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  behandlingId: 123,
  dokumentLinks: [],
  historikkinnslagDeler: [
    {
      aarsak: null,
      aarsakKodeverkType: null,
      aksjonspunkter: null,
      begrunnelse: null,
      begrunnelseKodeverkType: null,
      begrunnelseFritekst: 'Det må da være lov å ha litt overlappende uttak.',
      endredeFelter: [
        {
          endretFeltNavn: {
            kode: 'UTTAK_FASTSATT_FOR_PERIODE',
            kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
          },
          fraVerdi: null,
          klFraVerdi: null,
          klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
          klTilVerdi: null,
          navnVerdi: null,
          tilVerdi: '18.11.2024-10.01.2025',
        },
        {
          endretFeltNavn: {
            kode: 'UTTAK_FASTSATT_SØKERS_UTTAKSGRAD',
            kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
          },
          fraVerdi: null,
          klFraVerdi: null,
          klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
          klTilVerdi: null,
          navnVerdi: null,
          tilVerdi: '73',
        },
      ],
      gjeldendeFra: null,
      hendelse: {
        navn: {
          kode: 'FASTSATT_UTTAKSGRAD',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: [],
      resultat: null,
      skjermlenke: {
        kode: 'UTTAK',
        navn: 'Uttak',
        kodeverk: 'SKJERMLENKE_TYPE',
      },
      soeknadsperiode: null,
      tema: null,
    },
  ],
  opprettetAv: 'S123456',
  opprettetTidspunkt: '2025-01-16T09:27:30.595',
  type: {
    kode: 'FASTSATT_UTTAKSGRAD',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  uuid: '123',
};

export default behandlingStartet;
