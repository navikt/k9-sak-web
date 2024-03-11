import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { BehandlingerIndex } from './BehandlingerIndex';

describe('BehandlingerIndex', () => {
  it('skal rendre komponent korrekt', async () => {
    const fagsak = {
      saksnummer: '123',
    };
    const alleBehandlinger = [
      {
        id: 1,
      },
    ];

    render(
      <MemoryRouter>
        <BehandlingerIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
          setBehandlingIdOgVersjon={vi.fn()}
          setRequestPendingMessage={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(await screen.queryByTestId('IngenBehandlingValgtPanel')).toBeInTheDocument();
    expect(screen.queryByText('Velg behandling')).toBeInTheDocument();
  });
});
