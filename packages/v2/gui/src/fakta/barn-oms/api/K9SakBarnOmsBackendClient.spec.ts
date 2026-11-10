import { behandlingÅrskvantumUttak_getBarnOgRammevedtak } from '@k9-sak-web/backend/k9sak/api/behandlingÅrskvantumUttak.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BarnOmsBackendApiType } from './BarnOmsBackendApiType.js';
import { barnOmsQueryOptions } from './barnOmsQueryOptions.js';
import { K9SakBarnOmsBackendClient } from './K9SakBarnOmsBackendClient.js';

vi.mock('@k9-sak-web/backend/k9sak/api/behandlingÅrskvantumUttak.js', () => ({
  behandlingÅrskvantumUttak_getBarnOgRammevedtak: vi.fn(),
}));

const request = new Request('http://localhost/k9/sak/api/behandling/aarskvantum/barn');

type SdkSvar = Awaited<ReturnType<typeof behandlingÅrskvantumUttak_getBarnOgRammevedtak>>;

const svar = (data: SdkSvar['data'], status: number): SdkSvar => ({
  data,
  request,
  response: new Response(status === 204 ? null : JSON.stringify(data), { status }),
});

describe('K9SakBarnOmsBackendClient', () => {
  beforeEach(() => {
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockReset();
  });

  it('returnerer barn og rammevedtak ved 200', async () => {
    const data = {
      barn: [{ personIdent: '12345678901', barnType: 'VANLIG' }],
      rammevedtak: [{ type: 'UtvidetRett', utvidetRettFor: '12345678901' }],
    } satisfies SdkSvar['data'];
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockResolvedValue(svar(data, 200));

    const resultat = await new K9SakBarnOmsBackendClient().hentBarnOgRammevedtak('behandling-uuid');

    expect(resultat).toEqual(data);
    expect(behandlingÅrskvantumUttak_getBarnOgRammevedtak).toHaveBeenCalledWith({
      query: { behandlingUuid: 'behandling-uuid' },
    });
  });

  it('gir tomme lister når 200 mangler lister', async () => {
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockResolvedValue(svar({}, 200));

    const resultat = await new K9SakBarnOmsBackendClient().hentBarnOgRammevedtak('behandling-uuid');

    expect(resultat).toEqual({ barn: [], rammevedtak: [] });
  });

  it('gir tomme lister ved 204 uten innhold', async () => {
    // Generert klient gir tomt objekt som data ved 204
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockResolvedValue(svar({}, 204));

    const resultat = await new K9SakBarnOmsBackendClient().hentBarnOgRammevedtak('behandling-uuid');

    expect(resultat).toEqual({ barn: [], rammevedtak: [] });
  });

  it.each([403, 404, 500])('sender feil videre ved %i', async status => {
    const feil = new ExtendedApiError(request, new Response(null, { status }), 'Feil', null);
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockRejectedValue(feil);

    await expect(new K9SakBarnOmsBackendClient().hentBarnOgRammevedtak('behandling-uuid')).rejects.toBe(feil);
  });

  it('sender nettverksfeil videre', async () => {
    const feil = new TypeError('Failed to fetch');
    vi.mocked(behandlingÅrskvantumUttak_getBarnOgRammevedtak).mockRejectedValue(feil);

    await expect(new K9SakBarnOmsBackendClient().hentBarnOgRammevedtak('behandling-uuid')).rejects.toBe(feil);
  });
});

describe('barnOmsQueryOptions', () => {
  const lagApi = (): BarnOmsBackendApiType => ({
    backend: 'k9sak',
    hentBarnOgRammevedtak: vi.fn(async () => ({ barn: [], rammevedtak: [] })),
  });

  it('har behandlingsversjon og backend i nøkkelen', () => {
    expect(barnOmsQueryOptions(lagApi(), 'uuid', 3).queryKey).toEqual([
      'barnOms',
      'barnOgRammevedtak',
      'uuid',
      3,
      'k9sak',
    ]);
  });

  it('har egen cache per behandlingsversjon', async () => {
    const api = lagApi();
    vi.mocked(api.hentBarnOgRammevedtak)
      .mockResolvedValueOnce({ barn: [{ personIdent: 'versjon-1' }], rammevedtak: [] })
      .mockResolvedValueOnce({ barn: [{ personIdent: 'versjon-2' }], rammevedtak: [] });
    const queryClient = new QueryClient();

    await queryClient.ensureQueryData(barnOmsQueryOptions(api, 'uuid', 1));
    await queryClient.ensureQueryData(barnOmsQueryOptions(api, 'uuid', 1));
    await queryClient.ensureQueryData(barnOmsQueryOptions(api, 'uuid', 2));

    expect(api.hentBarnOgRammevedtak).toHaveBeenCalledTimes(2);
    expect(queryClient.getQueryData(barnOmsQueryOptions(api, 'uuid', 1).queryKey)?.barn[0]?.personIdent).toBe(
      'versjon-1',
    );
    expect(queryClient.getQueryData(barnOmsQueryOptions(api, 'uuid', 2).queryKey)?.barn[0]?.personIdent).toBe(
      'versjon-2',
    );
  });
});
