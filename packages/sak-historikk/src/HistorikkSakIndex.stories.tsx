import React from 'react';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { getKodeverkNavnFraKodeFnMock } from '@k9-sak-web/lib/kodeverk/mocks/kodeverkNavnFraKodeMock.js';
import HistorikkSakIndex from './HistorikkSakIndex';

const history = [
  {
    behandlingId: 999951,
    type: 'NYE_REGOPPLYSNINGER', // 'HISTORIKKINNSLAG_TYPE'
    aktoer: 'VL', // 'HISTORIKK_AKTOER'
    kjoenn: '-', // 'BRUKER_KJOENN'
    opprettetAv: 'Srvengangsstonad',
    opprettetTidspunkt: '2019-09-19T12:16:14.499',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: 'SAKSBEH_START_PA_NYTT', // 'HISTORIKK_BEGRUNNELSE_TYPE'
        begrunnelseFritekst: null,
        hendelse: {
          navn: 'NYE_REGOPPLYSNINGER', // 'HISTORIKKINNSLAG_TYPE'
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
    type: 'INNSYN_OPPR', // 'HISTORIKKINNSLAG_TYPE'
    aktoer: 'SBH', // 'HISTORIKK_AKTOER'
    kjoenn: '-', // 'BRUKER_KJOENN'
    opprettetAv: 'Z991110',
    opprettetTidspunkt: '2019-09-18T15:25:31.291',
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        begrunnelse: null,
        begrunnelseFritekst: 'Krav om innsyn mottatt 18.09.2019',
        hendelse: {
          navn: 'INNSYN_OPPR', // 'HISTORIKKINNSLAG_TYPE'
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
    type: 'BEH_STARTET', // 'HISTORIKKINNSLAG_TYPE'
    aktoer: 'SOKER', // 'HISTORIKK_AKTOER'
    kjoenn: 'K', // 'BRUKER_KJOENN'
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
          navn: 'BEH_STARTET', // 'HISTORIKKINNSLAG_TYPE'
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
    <div className="grid gap-5">
      {history.map(h => (
        <HistorikkSakIndex
          key={h.behandlingId}
          historikkinnslag={h}
          saksnummer="2"
          getBehandlingLocation={() => locationMock}
          createLocationForSkjermlenke={() => locationMock}
          erTilbakekreving={false}
          kodeverkNavnFraKodeFn={getKodeverkNavnFraKodeFnMock(alleKodeverk)}
        />
      ))}
    </div>
  </div>
);
