import type { Historikkinnslag } from '@k9-sak-web/types';

export const historikkSakV1: Historikkinnslag[] = [
  {
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1005501,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'VEDTAK_FATTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: 'INNVILGET',
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-20T07:07:59.106',
    type: {
      kode: 'VEDTAK_FATTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: 'ab6b49a9-84a3-40e6-a038-ac51f1a1304d',
  },
  {
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1005501,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: 'test',
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'FASTSETT_VIDERE_BEHANDLING',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: 'TILBAKEKR_VIDERE_BEH',
            navnVerdi: undefined,
            tilVerdi: 'TILBAKEKR_OPPRETT',
          },
        ],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'TILBAKEKR_VIDEREBEHANDLING',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: {
          kode: 'FAKTA_OM_SIMULERING',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-20T07:07:51.914',
    type: {
      kode: 'TILBAKEKR_VIDEREBEHANDLING',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '0b1fecdc-3270-469c-9507-493adc66f0f7',
  },
  {
    aktoer: {
      kode: 'SOKER',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: undefined,
    dokumentLinks: [
      {
        dokumentId: '454327391',
        journalpostId: '453925540',
        tag: 'Søknad',
        utgått: false,
      },
    ],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'VEDLEGG_MOTTATT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-20T07:06:58.758',
    type: {
      kode: 'VEDLEGG_MOTTATT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '30461cb8-d6ac-40b5-ab21-1d685df90d84',
  },
  {
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1005501,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: {
          kode: 'RE-END-FRA-BRUKER',
          kodeverk: 'BEHANDLING_AARSAK',
        },
        begrunnelseKodeverkType: 'BEHANDLING_AARSAK',
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'REVURD_OPPR',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-20T07:06:56.979',
    type: {
      kode: 'REVURD_OPPR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: 'f4554e3a-1964-48f5-8b00-615ce840cf0c',
  },
  {
    aktoer: {
      kode: 'BESL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'VEDTAK_FATTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: 'INNVILGET',
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'Z990422',
    opprettetTidspunkt: '2025-01-16T07:07:34.406',
    type: {
      kode: 'VEDTAK_FATTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: 'd577e8e5-6d55-4063-9793-d87e3bf065da',
  },
  {
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'FORSLAG_VEDTAK',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: 'INNVILGET',
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-16T07:06:30.17',
    type: {
      kode: 'FORSLAG_VEDTAK',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '8de187c9-ffc2-43fa-b792-243f2eaab577',
  },
  {
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: 'Sykdom manuelt behandlet.',
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: undefined,
        opplysninger: [],
        resultat: undefined,
        skjermlenke: {
          kode: 'PUNKT_FOR_MEDISINSK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-16T07:05:25.69',
    type: {
      kode: 'FAKTA_ENDRET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '462e4b96-f495-4c67-9054-ea787d703f65',
  },
  {
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'BEH_GJEN',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-16T06:59:31.487',
    type: {
      kode: 'BEH_GJEN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: 'ec046eaf-1db4-4a92-9dfe-900cb6b4a06e',
  },
  {
    aktoer: {
      kode: 'ARBEIDSGIVER',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: undefined,
    dokumentLinks: [
      {
        dokumentId: '454322584',
        journalpostId: '453920793',
        tag: 'Inntektsmelding',
        utgått: false,
      },
    ],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'VEDLEGG_MOTTATT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-16T06:59:30.613',
    type: {
      kode: 'VEDLEGG_MOTTATT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '745400e4-5977-49cf-aedd-b72ecec76412',
  },
  {
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst:
          'Oppgave til INTERESSANT INTUITIV KATT DIAMETER om å sende inntektsmelding for skjæringstidspunkt 2024-10-01',
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'INNTEKTSMELDING_FORESPURT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-16T06:44:26.799',
    type: {
      kode: 'INNTEKTSMELDING_FORESPURT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: 'ae560057-a553-43c7-bd99-7edf728bae94',
  },
  {
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1004852,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: {
          kode: 'VENTER_ETTERLYS_IM',
          kodeverk: 'VENT_AARSAK',
        },
        aarsakKodeverkType: 'VENT_AARSAK',
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'BEH_VENT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: '23.01.2025',
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-16T06:44:25.917',
    type: {
      kode: 'BEH_VENT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '0db31cb1-a00f-470a-bda3-313e6613762f',
  },
  {
    aktoer: {
      kode: 'SOKER',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: undefined,
    dokumentLinks: [
      {
        dokumentId: '454322582',
        journalpostId: '453920792',
        tag: 'Søknad',
        utgått: false,
      },
      {
        dokumentId: '454322583',
        journalpostId: '453920792',
        tag: 'Vedlegg',
        utgått: false,
      },
    ],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'VEDLEGG_MOTTATT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'K9-sak',
    opprettetTidspunkt: '2025-01-16T06:44:06.316',
    type: {
      kode: 'VEDLEGG_MOTTATT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '92bfbbef-9c71-483c-885b-a5b393679b53',
  },
  {
    aktoer: {
      kode: 'BESL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 1000301,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: [
          {
            aksjonspunktBegrunnelse: 'test',
            aksjonspunktKode: '9001',
            godkjent: true,
          },
        ],
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'SAK_RETUR',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: {
          kode: 'FAKTA_OM_MEDISINSK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
      {
        aarsak: undefined,
        aarsakKodeverkType: undefined,
        aksjonspunkter: [
          {
            aksjonspunktBegrunnelse: 'Vedtaksbrev må vurderes igjen',
            aksjonspunktKode: '5015',
            godkjent: false,
          },
        ],
        begrunnelse: undefined,
        begrunnelseKodeverkType: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: undefined,
        opplysninger: [],
        resultat: undefined,
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'Z990422',
    opprettetTidspunkt: '2024-12-02T07:46:22.373',
    type: {
      kode: 'SAK_RETUR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    uuid: '52ae8488-6376-4c50-949c-f03abc9676f8',
  },
];
