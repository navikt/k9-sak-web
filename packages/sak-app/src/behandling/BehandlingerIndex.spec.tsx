import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';

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
          setBehandlingIdOgVersjon={sinon.spy()}
          setRequestPendingMessage={sinon.spy()}
        />
      </MemoryRouter>
    );

    expect(await screen.queryByTestId("IngenBehandlingValgtPanel")).toBeInTheDocument();
    expect(screen.queryByText('Velg behandling')).toBeInTheDocument();
  });
});
