import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import messages from '../../i18n/nb_NO.json';
import FagsakSearch from './FagsakSearch';

describe('<FagsakSearch>', () => {
  const fagsak: Fagsak = {
    saksnummer: '12345',
    sakstype: fagsakYtelsesType.FP, // FAGSAK_YTELSE
    relasjonsRolleType: 'TEST',
    status: {
      kode: fagsakStatus.UNDER_BEHANDLING,
      kodeverk: 'FAGSAK_STATUS',
    },
    barnFodt: '13‎.‎02‎.‎2017‎',
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    endret: '13‎.‎02‎.‎2017‎',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    person: {
      erDod: false,
      navn: 'Frida',
      alder: 44,
      personnummer: '0405198632231',
      erKvinne: true,
      personstatusType: 'TEST',
    },
    dekningsgrad: 100,
  };
  const fagsak1: Fagsak = { ...fagsak, saksnummer: '12346' };

  it('skal kun vise søkefelt før søk er startet', () => {
    const searchFagsakFunction = vi.fn();
    renderWithIntlAndReduxForm(
      <FagsakSearch
        fagsaker={[]}
        searchFagsakCallback={searchFagsakFunction}
        searchResultReceived={false}
        selectFagsakCallback={vi.fn()}
        searchStarted
      />,
      { messages },
    );
    expect(screen.getByLabelText('Saksnummer eller fødselsnummer/D-nummer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Søk' })).toBeInTheDocument();
  });

  it('skal vise søkefelt og label for ingen søketreff når ingen fagsaker blir hentet', () => {
    renderWithIntlAndReduxForm(
      <FagsakSearch
        fagsaker={[]}
        searchFagsakCallback={vi.fn()}
        searchResultReceived
        selectFagsakCallback={vi.fn()}
        searchStarted
      />,
      { messages },
    );
    expect(screen.getByLabelText('Saksnummer eller fødselsnummer/D-nummer')).toBeInTheDocument();
    expect(screen.getByText('Søket ga ingen treff')).toBeInTheDocument();
  });

  it('skal vise søkefelt og søketreff der to fagsaker blir vist', () => {
    const searchFagsakFunction = vi.fn();
    const selectFagsakFunction = vi.fn();
    renderWithIntlAndReduxForm(
      <FagsakSearch
        fagsaker={[fagsak, fagsak1]}
        searchFagsakCallback={searchFagsakFunction}
        searchResultReceived
        selectFagsakCallback={selectFagsakFunction}
        searchStarted
      />,
      { messages },
    );
    expect(screen.getByLabelText('Saksnummer eller fødselsnummer/D-nummer')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('12346')).toBeInTheDocument();
  });
});
