import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { beregningsgrunnlagQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BeregningProsessStegInitPanel } from './BeregningProsessStegInitPanel';

const behandling = { uuid: 'behandling-uuid', versjon: 1 } as BehandlingDto;

describe('BeregningProsessStegInitPanel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  const createApi = (getBeregningsgrunnlag: AktivitetspengerApi['getBeregningsgrunnlag']): AktivitetspengerApi =>
    Object.assign(new FakeAktivitetspengerApi(), { getBeregningsgrunnlag }) as AktivitetspengerApi;

  const renderPanel = (api: AktivitetspengerApi) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProsessPanelContext.Provider value={{ erValgt: () => true, erTilBehandlingEllerBehandlet: () => false }}>
          <Suspense fallback="laster">
            <BeregningProsessStegInitPanel api={api} behandling={behandling} />
          </Suspense>
        </ProsessPanelContext.Provider>
      </QueryClientProvider>,
    );

  test('viser hentefeil', async () => {
    const getBeregningsgrunnlag = vi.fn().mockRejectedValue(new Error('Feil ved henting'));
    const api = createApi(getBeregningsgrunnlag);
    await queryClient.fetchQuery(beregningsgrunnlagQueryOptions(api, behandling)).catch(() => undefined);

    renderPanel(api);

    expect(await screen.findByText('Vi fikk ikke hentet opplysningene til dette steget.')).toBeVisible();
    expect(getBeregningsgrunnlag).toHaveBeenCalledTimes(1);
  });

  test('viser at steget ikke er behandlet når beregningsgrunnlaget ikke har hentefeil', async () => {
    const getBeregningsgrunnlag = vi.fn().mockResolvedValue(null);
    const api = createApi(getBeregningsgrunnlag);
    await queryClient.fetchQuery(beregningsgrunnlagQueryOptions(api, behandling));

    renderPanel(api);

    expect(await screen.findByText(/Dette steget er ikke behandlet/)).toBeVisible();
  });
});
