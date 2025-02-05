import { Historikkinnslag } from '@k9-sak-web/types';

export const historikkTilbakeV1: Historikkinnslag[] = [
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'VEDTAK_FATTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'BESL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Z990422',
    opprettetTidspunkt: '2025-01-23T14:47:25.437',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: undefined,
        hendelse: {
          navn: {
            kode: 'VEDTAK_FATTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: undefined,
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: undefined,
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'FORSLAG_VEDTAK',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-23T14:45:45.75',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: undefined,
        hendelse: {
          navn: {
            kode: 'FORSLAG_VEDTAK',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: undefined,
        skjermlenke: {
          kode: 'VEDTAK',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: 'FULL_TILBAKEBETALING',
        endredeFelter: undefined,
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'TILBAKEKREVING',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-23T14:04:29.879',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: 'test',
        hendelse: undefined,
        opplysninger: [
          {
            opplysningType: {
              kode: 'PERIODE_FOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '07.10.2024',
          },
          {
            opplysningType: {
              kode: 'PERIODE_TOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '20.10.2024',
          },
          {
            opplysningType: {
              kode: 'TILBAKEKREVING_OPPFYLT_BEGRUNNELSE',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: 'test',
          },
          {
            opplysningType: {
              kode: 'SÆRLIG_GRUNNER_BEGRUNNELSE',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: 'test',
          },
        ],
        skjermlenke: {
          kode: 'TILBAKEKREVING',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'ER_VILKARENE_TILBAKEKREVING_OPPFYLT',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'Ja, mottaker forsto eller burde forstått at utbetalingen skyldtes en feil (1. ledd, 1. punkt)',
            klFraVerdi: undefined,
            klTilVerdi: undefined,
          },
          {
            endretFeltNavn: {
              kode: 'MOTTAKER_UAKTSOMHET_GRAD',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'Simpel uaktsomhet',
            klFraVerdi: undefined,
            klTilVerdi: undefined,
          },
          {
            endretFeltNavn: {
              kode: 'ER_SARLIGE_GRUNNER_TIL_REDUKSJON',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'Nei: Graden av uaktsomhet hos den kravet retter seg mot',
            klFraVerdi: undefined,
            klTilVerdi: undefined,
          },
        ],
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'FORELDELSE',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-23T14:03:54.486',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: 'test',
        hendelse: undefined,
        opplysninger: [
          {
            opplysningType: {
              kode: 'PERIODE_FOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '07.10.2024',
          },
          {
            opplysningType: {
              kode: 'PERIODE_TOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '20.10.2024',
          },
        ],
        skjermlenke: {
          kode: 'FORELDELSE',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'FORELDELSE',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'Perioden er ikke foreldet',
            klFraVerdi: undefined,
            klTilVerdi: undefined,
          },
        ],
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'FAKTA_OM_FEILUTBETALING',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Z990404',
    opprettetTidspunkt: '2025-01-23T14:03:40.06',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: 'test',
        hendelse: undefined,
        opplysninger: [
          {
            opplysningType: {
              kode: 'PERIODE_FOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '07.10.2024',
          },
          {
            opplysningType: {
              kode: 'PERIODE_TOM',
              kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
            },
            tilVerdi: '20.10.2024',
          },
        ],
        skjermlenke: {
          kode: 'FAKTA_OM_FEILUTBETALING',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'HENDELSE_AARSAK',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'PSB_ANNET_TYPE',
            klFraVerdi: undefined,
            klTilVerdi: 'HENDELSE_TYPE',
          },
          {
            endretFeltNavn: {
              kode: 'HENDELSE_UNDER_AARSAK',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            navnVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            fraVerdi: undefined,
            tilVerdi: 'ANNET_FRITEKST',
            klFraVerdi: undefined,
            klTilVerdi: 'HENDELSE_UNDERTYPE',
          },
        ],
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'BEH_GJEN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Srvk9-tilbake',
    opprettetTidspunkt: '2025-01-23T05:59:09.733',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: undefined,
        hendelse: {
          navn: {
            kode: 'BEH_GJEN',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: undefined,
        skjermlenke: undefined,
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: undefined,
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'BEH_VENT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Srvk9-tilbake',
    opprettetTidspunkt: '2025-01-20T07:08:07.364',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: undefined,
        hendelse: {
          navn: {
            kode: 'BEH_VENT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: '17.02.2025',
        },
        opplysninger: undefined,
        skjermlenke: undefined,
        aarsak: {
          kode: 'VENT_PÅ_TILBAKEKREVINGSGRUNNLAG',
          kodeverk: 'VENT_AARSAK',
        },
        årsaktekst: 'Venter på tilbakekrevingsgrunnlag fra økonomi',
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: undefined,
        aksjonspunkter: undefined,
      },
    ],
  },
  {
    behandlingId: 12802,
    behandlingUuid: 'ad2dc9bb-5c07-4bbd-864d-d833da6fafee',
    type: {
      kode: 'TILBAKEKREVING_OPPR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    opprettetAv: 'Srvk9-tilbake',
    opprettetTidspunkt: '2025-01-20T07:08:06.623',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: undefined,
        begrunnelsetekst: undefined,
        begrunnelseFritekst: undefined,
        hendelse: {
          navn: {
            kode: 'TILBAKEKREVING_OPPR',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: undefined,
        skjermlenke: undefined,
        aarsak: undefined,
        årsaktekst: undefined,
        tema: undefined,
        gjeldendeFra: undefined,
        resultat: undefined,
        endredeFelter: undefined,
        aksjonspunkter: undefined,
      },
    ],
  },
];
