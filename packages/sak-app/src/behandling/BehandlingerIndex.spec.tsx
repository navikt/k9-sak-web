import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';
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
        <KodeverkProvider
          behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
          kodeverk={alleKodeverkV2}
          klageKodeverk={alleKodeverkV2}
          tilbakeKodeverk={alleKodeverkV2}
        >
          <BehandlingerIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
            setRequestPendingMessage={vi.fn()}
          />
        </KodeverkProvider>
      </MemoryRouter>,
    );

    expect(await screen.queryByTestId('IngenBehandlingValgtPanel')).toBeInTheDocument();
    expect(screen.queryByText('Velg behandling')).toBeInTheDocument();
  });
});
