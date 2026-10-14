import type { AsyncPollingStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeFakeExtendedApiError } from '../../storybook/mocks/fakeExtendedApiError.js';
import type { AktivitetspengerApi } from './AktivitetspengerApi.js';
import { behandlingQueryOptions } from './aktivitetspengerQueryOptions.js';

const behandling = { uuid: 'behandling-uuid', versjon: 1 };
const behandlingFraBackend = { uuid: 'behandling-uuid', versjon: 2 } as BehandlingDto;

const lagApi = (hentBehandlingMidlertidigStatus: AktivitetspengerApi['hentBehandlingMidlertidigStatus']) => {
  const getBehandling = vi.fn(async () => behandlingFraBackend);
  const api = {
    backend: 'ungsak',
    hentBehandlingMidlertidigStatus: vi.fn(hentBehandlingMidlertidigStatus),
    getBehandling,
  } as unknown as AktivitetspengerApi;
  return { api, getBehandling, hentStatus: vi.mocked(api.hentBehandlingMidlertidigStatus) };
};

const kjørQueryFn = (api: AktivitetspengerApi) => {
  const queryFn = behandlingQueryOptions(api, behandling).queryFn as (ctx: {
    signal: AbortSignal;
  }) => Promise<BehandlingDto>;
  return queryFn({ signal: new AbortController().signal });
};

const status = (s: AsyncPollingStatus['status']): AsyncPollingStatus => ({ status: s, pollIntervalMillis: 1 });

describe('behandlingQueryOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('henter behandling direkte når ingen prosess pågår', async () => {
    const { api, getBehandling, hentStatus } = lagApi(async () => status('COMPLETE'));

    await expect(kjørQueryFn(api)).resolves.toBe(behandlingFraBackend);
    expect(hentStatus).toHaveBeenCalledTimes(1);
    expect(getBehandling).toHaveBeenCalledTimes(1);
  });

  it('poller til prosessen er ferdig før behandling hentes', async () => {
    const statuser = [status('PENDING'), status('PENDING'), status('COMPLETE')];
    const { api, getBehandling, hentStatus } = lagApi(async () => statuser.shift()!);

    await expect(kjørQueryFn(api)).resolves.toBe(behandlingFraBackend);
    expect(hentStatus).toHaveBeenCalledTimes(3);
    expect(getBehandling).toHaveBeenCalledTimes(1);
    expect(hentStatus.mock.invocationCallOrder[2]).toBeLessThan(getBehandling.mock.invocationCallOrder[0]!);
  });

  it.each(['HALTED', 'DELAYED'])('henter behandling og melder feilen når status er %s', async pollingStatus => {
    const feil = makeFakeExtendedApiError({ status: 418, body: { status: pollingStatus } });
    const rejectSpy = vi.spyOn(Promise, 'reject').mockReturnValue(new Promise(() => {}));
    const { api, getBehandling } = lagApi(async () => {
      throw feil;
    });

    await expect(kjørQueryFn(api)).resolves.toBe(behandlingFraBackend);
    expect(getBehandling).toHaveBeenCalledTimes(1);
    expect(rejectSpy).toHaveBeenCalledWith(feil);
  });

  it('kaster andre feil videre uten å hente behandling', async () => {
    const feil = makeFakeExtendedApiError({ status: 500 });
    const { api, getBehandling } = lagApi(async () => {
      throw feil;
    });

    await expect(kjørQueryFn(api)).rejects.toBe(feil);
    expect(getBehandling).not.toHaveBeenCalled();
  });

  it('kaster 418 videre når status ikke er HALTED eller DELAYED', async () => {
    const feil = makeFakeExtendedApiError({ status: 418, body: { status: 'CANCELLED' } });
    const { api, getBehandling } = lagApi(async () => {
      throw feil;
    });

    await expect(kjørQueryFn(api)).rejects.toBe(feil);
    expect(getBehandling).not.toHaveBeenCalled();
  });
});
