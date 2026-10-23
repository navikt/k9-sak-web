import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ForutgåendeMedlemskapInitPanel } from './ForutgåendeMedlemskapInitPanel';

vi.mock('@k9-sak-web/gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap.js', () => ({
  ForutgåendeMedlemskap: () => <div data-testid={'forutgående-medlemskap'} />,
}));

const createApi = (): AktivitetspengerApi =>
  Object.assign(new FakeAktivitetspengerApi(), {
    getAksjonspunkter: async () => [],
    getInnloggetBruker: async () => ({}),
    hentMedlemskapFraSøknad: async () => ({ perioder: [] }),
  }) as unknown as AktivitetspengerApi;

const behandling = { uuid: 'behandling-uuid', versjon: 1, status: BehandlingStatus.UTREDES } as BehandlingDto;

describe('ForutgåendeMedlemskapInitPanel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  const renderPanel = (erTilBehandlingEllerBehandlet: boolean) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProsessPanelContext.Provider
          value={{ erValgt: () => true, erTilBehandlingEllerBehandlet: () => erTilBehandlingEllerBehandlet }}
        >
          <Suspense fallback={'laster'}>
            <ForutgåendeMedlemskapInitPanel
              api={createApi()}
              behandling={behandling}
              onAksjonspunktBekreftet={() => {}}
            />
          </Suspense>
        </ProsessPanelContext.Provider>
      </QueryClientProvider>,
    );

  test('viser at steget ikke er behandlet når det ikke er til behandling eller behandlet', async () => {
    renderPanel(false);

    expect(await screen.findByText(/Dette steget er ikke behandlet/)).toBeVisible();
    expect(screen.queryByTestId('forutgående-medlemskap')).not.toBeInTheDocument();
  });

  test('viser forutgående medlemskap når steget er til behandling eller behandlet', async () => {
    renderPanel(true);

    expect(await screen.findByTestId('forutgående-medlemskap')).toBeVisible();
  });
});
