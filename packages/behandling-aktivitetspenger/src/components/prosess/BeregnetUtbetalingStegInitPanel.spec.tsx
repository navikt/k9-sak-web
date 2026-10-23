import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { satsOgUtbetalingPerioderQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BeregnetUtbetalingStegInitPanel } from './BeregnetUtbetalingStegInitPanel';

vi.mock('@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendClient.js', () => ({
  AktivitetspengerBeregningBackendClient: class {
    getArbeidsgiverOpplysninger = vi.fn().mockResolvedValue({});
  },
}));

const createApi = (overrides: Partial<AktivitetspengerApi> = {}): AktivitetspengerApi =>
  Object.assign(new FakeAktivitetspengerApi(), overrides) as unknown as AktivitetspengerApi;

const createBehandling = () => ({ uuid: 'behandling-uuid', versjon: 1 }) as BehandlingDto;

describe('BeregnetUtbetalingStegInitPanel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  const renderPanel = (api: AktivitetspengerApi, behandling: BehandlingDto) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProsessPanelContext.Provider value={{ erValgt: () => true, erTilBehandlingEllerBehandlet: () => false }}>
          <Suspense fallback={null}>
            <BeregnetUtbetalingStegInitPanel api={api} behandling={behandling} onAksjonspunktBekreftet={vi.fn()} />
          </Suspense>
        </ProsessPanelContext.Provider>
      </QueryClientProvider>,
    );

  test('viser hentefeil for satser', async () => {
    const getSatsOgUtbetalingPerioder = vi.fn().mockRejectedValue(new Error('henting feilet'));
    const api = createApi({ getSatsOgUtbetalingPerioder });
    const behandling = createBehandling();

    await queryClient.fetchQuery(satsOgUtbetalingPerioderQueryOptions(api, behandling)).catch(() => undefined);

    renderPanel(api, behandling);

    expect(await screen.findByText('Vi fikk ikke hentet opplysningene til dette steget.')).toBeInTheDocument();
    expect(getSatsOgUtbetalingPerioder).toHaveBeenCalledTimes(1);
  });

  test('viser hentefeil når henting av inntektskontroll feiler', async () => {
    const api = createApi({
      getSatsOgUtbetalingPerioder: vi.fn().mockResolvedValue([]),
      getKontrollerInntekt: vi.fn().mockRejectedValue(new Error('henting feilet')),
    });

    renderPanel(api, createBehandling());

    expect(await screen.findByText('Vi fikk ikke hentet opplysningene til dette steget.')).toBeInTheDocument();
  });

  test('viser at steget ikke er behandlet når henting ikke feiler', async () => {
    const api = createApi({
      getSatsOgUtbetalingPerioder: vi.fn().mockResolvedValue([]),
      getKontrollerInntekt: vi.fn().mockResolvedValue({ kontrollperioder: [] }),
    });

    renderPanel(api, createBehandling());

    expect(await screen.findByText('Dette steget er ikke behandlet')).toBeInTheDocument();
  });
});
