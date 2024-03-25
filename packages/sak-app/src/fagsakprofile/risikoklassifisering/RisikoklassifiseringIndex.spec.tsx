import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import RisikoklassifiseringIndex from './RisikoklassifiseringIndex';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

const fagsak = {
  saksnummer: '123456',
};

const behandling = {
  id: 1,
};

const initialEntries = [
  {
    hash: '23',
    pathname: '/test/',
    state: {},
    search: '',
  },
];

const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

describe('<RisikoklassifiseringIndex>', () => {
  it('skal rendere komponent', async () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);

    render(
      <MemoryRouter initialEntries={initialEntries} initialIndex={0}>
        <RisikoklassifiseringIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
          kontrollresultat={lagRisikoklassifisering(kontrollresultatKode.HOY)}
          behandlingVersjon={1}
          behandlingId={1}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('button', { name: 'Faresignaler oppdaget' })).toBeInTheDocument();
  });
});
