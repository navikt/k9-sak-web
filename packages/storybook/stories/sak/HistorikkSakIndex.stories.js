import React from 'react';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import alleKodeverk from '../mocks/alleKodeverk.json';

const history = [
  {
    behandlingId: 999951,
    type: {
      kode: 'NYE_REGOPPLYSNINGER', // historikktype 1
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
  },
  {
    behandlingId: null,
    type: {
      kode: 'INNSYN_OPPR', // historikktype 1
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
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst:
          'Krav om innsyn mottatt 18.09.2019. En lang tekst. En lang tekst. En lang tekst. En lang tekst.En lang tekst. ',
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
  },
  {
    behandlingId: 999952,
    type: {
      kode: 'BEH_STARTET', // historikktype 1
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
        url: 'http://127.0.0.1:8080/sak/api/dokument/hent-dokument?journalpostId=453471722&dokumentId=470153809',
        journalpostId: '453471722',
        dokumentId: '470153809',
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
  },
  {
    behandlingId: 999954,
    type: {
      kode: 'FORSLAG_VEDTAK', // historikktype 2
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'BESL',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    kjoenn: {
      kode: '-',
      kodeverk: 'BRUKER_KJOENN',
    },
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst: 'Tekst fra beslutter',
        hendelse: {
          navn: {
            kode: 'OVERSTYRT',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: null,
        },
        opplysninger: null,
        soeknadsperiode: null,
        skjermlenke: {
          kode: 'FAKTA_FOR_OMSORG',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: null,
        tema: null,
        gjeldendeFra: null,
        resultat: 'DELVIS_TILBAKEBETALING',
        endredeFelter: null,
        aksjonspunkter: null,
      },
    ],
  },
  {
    behandlingId: 999955,
    type: {
      kode: 'SAK_RETUR', // historikktype 3
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: {
      kode: 'ARBEIDSGIVER',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    kjoenn: {
      kode: '-',
      kodeverk: 'BRUKER_KJOENN',
    },
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst: 'Dummy begrunnelsesfritekst',
        hendelse: {
          navn: {
            kode: 'ANKEBEH_STARTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: null,
        },
        opplysninger: null,
        soeknadsperiode: null,
        skjermlenke: {
          kode: 'FAKTA_FOR_OMSORG',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: null,
        tema: null,
        gjeldendeFra: null,
        resultat: null,
        endredeFelter: null,
        aksjonspunkter: [
          {
            godkjent: true,
            aksjonspunktKode: aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          },
          {
            godkjent: false,
            aksjonspunktKode: aksjonspunktCodes.AVKLAR_UTTAK,
            aksjonspunktBegrunnelse: 'Dummybegrunnelse for punktet over',
          },
        ],
      },
    ],
  },
  {
    behandlingId: 999956,
    type: {
      kode: 'UTTAK', // historikktype 5
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
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst: 'Dummy begrunnelsesfritekst',
        hendelse: {
          navn: {
            kode: 'ANKEBEH_STARTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: null,
        },
        opplysninger: [
          {
            tilVerdi: '2',
            opplysningType: {
              kode: 'ANTALL_BARN',
            },
          },
        ],
        soeknadsperiode: {
          soeknadsperiodeType: {
            kode: 'GRADERING',
            kodeverk: 'HISTORIKK_AVKLART_SOEKNADSPERIODE_TYPE',
          },
          navnVerdi: 'navnVerdi',
          tilVerdi: 'tilVerdi',
        },
        skjermlenke: {
          kode: 'FAKTA_FOR_OMSORG',
          kodeverk: 'SKJERMLENKE_TYPE',
        },
        aarsak: null,
        tema: null,
        gjeldendeFra: {
          navn: 'INNTEKT_FRA_ARBEIDSFORHOLD',
          verdi: 'noe jobb eller no',
          fra: '21.04.2019',
        },
        resultat: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'AKTIVITET',
            },
            navnVerdi: 'aktiviteten',
            fraVerdi: 'BENYTT',
            tilVerdi: false,
          },
        ],
      },
    ],
  },
];

export default {
  title: 'sak/sak-historikk',
  component: HistorikkSakIndex,
};

export const visHistorikk = () => (
  <div
    style={{
      width: '600px',
      backgroundColor: 'white',
      padding: '30px',
    }}
  >
    {history.map(h => (
      <HistorikkSakIndex
        key={h.behandlingId}
        historieInnslag={h}
        selectedBehandlingId="1"
        saksnummer="2"
        location={{
          pathname: 'historikk',
        }}
        alleKodeverk={alleKodeverk}
      />
    ))}
  </div>
);
