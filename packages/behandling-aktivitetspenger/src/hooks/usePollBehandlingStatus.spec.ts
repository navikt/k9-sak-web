import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/ungsak/kodeverk/FagsakYtelsesType.js';
import type { AsyncPollingStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { behandlingQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { createQueryClient } from '@k9-sak-web/gui/shared/query/queryClient.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { delay } from '@k9-sak-web/gui/utils/delay.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePollBehandlingStatus } from './usePollBehandlingStatus';

const behandling = { uuid: 'behandling-uuid', versjon: 1 };
const nyBehandling = {
  uuid: 'behandling-uuid',
  versjon: 2,
  behandlingAnsvarlige: {},
  opprettet: '2026-01-01T00:00:00',
  sakstype: fagsakYtelsesType.AKTIVITETSPENGER,
  status: BehandlingStatus.UTREDES,
  type: behandlingType.FØRSTEGANGSSØKNAD,
} satisfies BehandlingDto;
const pending: AsyncPollingStatus = { status: 'PENDING', pollIntervalMillis: 5 };
const complete: AsyncPollingStatus = { status: 'COMPLETE' };

const lagApi = (statuser: () => AsyncPollingStatus) => {
  const api = new FakeAktivitetspengerApi();
  const hentStatus = vi
    .spyOn(api, 'hentBehandlingMidlertidigStatus')
    .mockImplementation(async (_uuid: string, signal: AbortSignal) => {
      await delay(0, signal);
      return statuser();
    });
  const getBehandling = vi.spyOn(api, 'getBehandling').mockResolvedValue(nyBehandling);
  return { api, hentStatus, getBehandling };
};

const iRekkefølge =
  (...statuser: AsyncPollingStatus[]) =>
  () => {
    const neste = statuser.shift();
    if (neste === undefined) {
      throw new Error('Ingen flere statuser');
    }
    return neste;
  };

describe('usePollBehandlingStatus', () => {
  let queryClient: QueryClient;
  const setBehandling = vi.fn();

  const render = (api: FakeAktivitetspengerApi) =>
    renderHook(() => usePollBehandlingStatus(api, behandling, setBehandling), {
      wrapper: ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children),
    });

  beforeEach(() => {
    queryClient = createQueryClient({ queries: { retry: false } });
    setBehandling.mockReset();
  });

  it('henter behandling og oppdaterer cache for gammel og ny versjon når polling er ferdig', async () => {
    const { api, getBehandling } = lagApi(iRekkefølge(pending, complete));
    const { result } = render(api);

    await act(() => result.current.pollTilBehandlingErKlar());

    expect(getBehandling).toHaveBeenCalledTimes(1);
    expect(setBehandling).toHaveBeenCalledWith(nyBehandling);
    expect(queryClient.getQueryData(behandlingQueryOptions(api, behandling).queryKey)).toBe(nyBehandling);
    expect(queryClient.getQueryData(behandlingQueryOptions(api, nyBehandling).queryKey)).toBe(nyBehandling);
    expect(result.current.isPolling).toBe(false);
  });

  it('avbryter polling ved unmount', async () => {
    const { api, hentStatus, getBehandling } = lagApi(() => pending);
    const { result, unmount } = render(api);

    let poll: Promise<void> = Promise.resolve();
    act(() => {
      poll = result.current.pollTilBehandlingErKlar();
    });
    await waitFor(() => expect(hentStatus.mock.calls.length).toBeGreaterThanOrEqual(2));

    unmount();
    await expect(poll).resolves.toBeUndefined();
    const antallKall = hentStatus.mock.calls.length;
    await delay(30);

    expect(hentStatus).toHaveBeenCalledTimes(antallKall);
    expect(getBehandling).not.toHaveBeenCalled();
    expect(setBehandling).not.toHaveBeenCalled();
  });

  it('avbryter pågående polling når ny polling startes', async () => {
    let ferdig = false;
    const { api, hentStatus, getBehandling } = lagApi(() => (ferdig ? complete : pending));
    const { result } = render(api);

    let førstePoll: Promise<void> = Promise.resolve();
    act(() => {
      førstePoll = result.current.pollTilBehandlingErKlar();
    });
    await waitFor(() => expect(hentStatus).toHaveBeenCalled());

    ferdig = true;
    await act(() => result.current.pollTilBehandlingErKlar());
    await expect(førstePoll).resolves.toBeUndefined();

    expect(getBehandling).toHaveBeenCalledTimes(1);
    expect(setBehandling).toHaveBeenCalledTimes(1);
  });
});
