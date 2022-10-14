import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import alleKodeverk from '../mocks/alleKodeverk.json';

const history = [
  {
    behandlingId: 999951,
    type: 'NYE_REGOPPLYSNINGER',
    aktoer: 'VL',
    kjoenn: '-',
    opprettetAv: 'Srvengangsstonad',
    opprettetTidspunkt: '2019-09-19T12:16:14.499',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: 'SAKSBEH_START_PA_NYTT',
        begrunnelseFritekst: null,
        hendelse: {
          navn: 'NYE_REGOPPLYSNINGER',
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
    type: 'INNSYN_OPPR',
    aktoer: 'SBH',
    kjoenn: '-',
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst: 'Krav om innsyn mottatt 18.09.2019',
        hendelse: {
          navn: 'INNSYN_OPPR',
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
    type: 'BEH_STARTET',
    aktoer: 'SOKER',
    kjoenn: 'K',
    opprettetAv: 'Srvengangsstonad',
    opprettetTidspunkt: '2019-09-18T13:12:48.874',
    dokumentLinks: [
      {
        tag: 'Søknad',
        url: 'http://127.0.0.1:8080/fpsak/api/dokument/hent-dokument?journalpostId=453471722&dokumentId=470153809',
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
          navn: 'BEH_STARTET',
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
];

const locationMock = {
  key: '1',
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

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
    <Router>
      {history.map(h => (
        <HistorikkSakIndex
          key={h.behandlingId}
          historikkinnslag={h}
          saksnummer="2"
          getBehandlingLocation={() => locationMock}
          alleKodeverk={alleKodeverk as any}
          createLocationForSkjermlenke={() => locationMock}
          erTilbakekreving={false}
        />
      ))}
    </Router>
  </div>
);
