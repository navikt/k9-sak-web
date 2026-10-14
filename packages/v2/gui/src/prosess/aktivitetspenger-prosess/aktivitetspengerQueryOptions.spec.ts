import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/ungsak/kodeverk/FagsakYtelsesType.js';
import type { AsyncPollingStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimeoutError } from '../../app/errorhandling/legacycompat/TimeoutError.js';
import { createQueryClient } from '../../shared/query/queryClient.js';
import { FakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi.js';
import { makeFakeExtendedApiError } from '../../storybook/mocks/fakeExtendedApiError.js';
import { behandlingQueryOptions, ventTilBehandlingErKlar } from './aktivitetspengerQueryOptions.js';

const behandling = { uuid: 'behandling-uuid', versjon: 1 };
const behandlingFraBackend = {
  uuid: 'behandling-uuid',
  versjon: 2,
  behandlingAnsvarlige: {},
  opprettet: '2026-01-01T00:00:00',
  sakstype: fagsakYtelsesType.AKTIVITETSPENGER,
  status: BehandlingStatus.UTREDES,
  type: behandlingType.FØRSTEGANGSSØKNAD,
} satisfies BehandlingDto;

const status = (s: AsyncPollingStatus['status']): AsyncPollingStatus => ({ status: s, pollIntervalMillis: 1 });

const lagApi = () => {
  const api = new FakeAktivitetspengerApi();
  const kall: string[] = [];
  const hentStatus = vi.spyOn(api, 'hentBehandlingMidlertidigStatus');
  const getBehandling = vi.spyOn(api, 'getBehandling').mockImplementation(async () => {
    kall.push('behandling');
    return behandlingFraBackend;
  });
  const statusSekvens = (...statuser: AsyncPollingStatus[]) =>
    hentStatus.mockImplementation(async () => {
      kall.push('status');
      const neste = statuser.shift();
      if (neste === undefined) {
        throw new Error('Ingen flere statuser');
      }
      return neste;
    });
  return { api, kall, hentStatus, getBehandling, statusSekvens };
};

const signal = () => new AbortController().signal;

describe('ventTilBehandlingErKlar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returnerer straks når ingen prosess pågår', async () => {
    const { api, hentStatus, statusSekvens } = lagApi();
    statusSekvens(status('COMPLETE'));

    await ventTilBehandlingErKlar(api, behandling.uuid, signal());

    expect(hentStatus).toHaveBeenCalledTimes(1);
  });

  it('poller til prosessen ikke lenger er PENDING', async () => {
    const { api, hentStatus, statusSekvens } = lagApi();
    statusSekvens(status('PENDING'), status('PENDING'), status('COMPLETE'));

    await ventTilBehandlingErKlar(api, behandling.uuid, signal());

    expect(hentStatus).toHaveBeenCalledTimes(3);
  });

  it.each(['HALTED', 'DELAYED'])('melder feilen og returnerer når status er %s', async pollingStatus => {
    const feil = makeFakeExtendedApiError({ status: 418, body: { status: pollingStatus } });
    const rejectSpy = vi.spyOn(Promise, 'reject').mockReturnValue(new Promise(() => {}));
    const { api, hentStatus } = lagApi();
    // mockRejectedValue bruker Promise.reject, som er mocket her
    hentStatus.mockImplementation(async () => {
      throw feil;
    });

    await expect(ventTilBehandlingErKlar(api, behandling.uuid, signal())).resolves.toBeUndefined();
    expect(rejectSpy).toHaveBeenCalledWith(feil);
  });

  it('kaster 418 videre når status ikke er HALTED eller DELAYED', async () => {
    const feil = makeFakeExtendedApiError({ status: 418, body: { status: 'CANCELLED' } });
    const { api, hentStatus } = lagApi();
    hentStatus.mockRejectedValue(feil);

    await expect(ventTilBehandlingErKlar(api, behandling.uuid, signal())).rejects.toBe(feil);
  });

  it('kaster andre feil videre', async () => {
    const feil = makeFakeExtendedApiError({ status: 500 });
    const { api, hentStatus } = lagApi();
    hentStatus.mockRejectedValue(feil);

    await expect(ventTilBehandlingErKlar(api, behandling.uuid, signal())).rejects.toBe(feil);
  });

  it('stopper når signalet avbrytes', async () => {
    const { api, hentStatus } = lagApi();
    const controller = new AbortController();
    hentStatus.mockImplementation(async () => {
      controller.abort();
      return status('PENDING');
    });

    await expect(ventTilBehandlingErKlar(api, behandling.uuid, controller.signal)).rejects.toThrow();
    expect(hentStatus).toHaveBeenCalledTimes(1);
  });

  it('kaster TimeoutError når pollgrensen er nådd', async () => {
    const { api, hentStatus } = lagApi();
    hentStatus.mockResolvedValue({ status: 'PENDING', pollIntervalMillis: 0 });

    await expect(ventTilBehandlingErKlar(api, behandling.uuid, signal())).rejects.toBeInstanceOf(TimeoutError);
    expect(hentStatus).toHaveBeenCalledTimes(150);
  });
});

describe('behandlingQueryOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('henter behandling først når prosessen er ferdig', async () => {
    const { api, kall, statusSekvens } = lagApi();
    statusSekvens(status('PENDING'), status('COMPLETE'));
    const queryClient = createQueryClient({ queries: { retry: false } });

    await expect(queryClient.query(behandlingQueryOptions(api, behandling))).resolves.toBe(behandlingFraBackend);
    expect(kall).toEqual(['status', 'status', 'behandling']);
  });

  it('henter ikke behandling når statuskallet feiler', async () => {
    const feil = makeFakeExtendedApiError({ status: 500 });
    const { api, hentStatus, getBehandling } = lagApi();
    hentStatus.mockRejectedValue(feil);
    const queryClient = createQueryClient({ queries: { retry: false } });

    await expect(queryClient.query(behandlingQueryOptions(api, behandling))).rejects.toBe(feil);
    expect(getBehandling).not.toHaveBeenCalled();
  });

  it('retryer ikke når pollgrensen er nådd', async () => {
    const { api, hentStatus, getBehandling } = lagApi();
    hentStatus.mockResolvedValue({ status: 'PENDING', pollIntervalMillis: 0 });
    const queryClient = createQueryClient({ queries: { retryDelay: 0 } });

    await expect(queryClient.query(behandlingQueryOptions(api, behandling))).rejects.toBeInstanceOf(TimeoutError);
    expect(hentStatus).toHaveBeenCalledTimes(150);
    expect(getBehandling).not.toHaveBeenCalled();
  });

  it('retryer andre feil tre ganger', async () => {
    const feil = makeFakeExtendedApiError({ status: 500 });
    const { api, hentStatus } = lagApi();
    hentStatus.mockRejectedValue(feil);
    const queryClient = createQueryClient({ queries: { retryDelay: 0 } });

    await expect(queryClient.query(behandlingQueryOptions(api, behandling))).rejects.toBe(feil);
    expect(hentStatus).toHaveBeenCalledTimes(4);
  });
});
