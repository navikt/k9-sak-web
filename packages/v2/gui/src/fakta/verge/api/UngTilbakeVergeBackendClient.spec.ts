import { verge_hentVerge } from '@k9-sak-web/backend/ungtilbake/api/verge.js';
import type { VergeDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/verge/VergeDto.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UngTilbakeVergeBackendClient } from './UngTilbakeVergeBackendClient.js';

vi.mock('@k9-sak-web/backend/ungtilbake/api/verge.js', () => ({
  verge_hentVerge: vi.fn(),
}));

const request = new Request('http://localhost/ung/tilbake/api/verge');

describe('UngTilbakeVergeBackendClient', () => {
  beforeEach(() => {
    vi.mocked(verge_hentVerge).mockReset();
  });

  it('returnerer lagret verge ved 200 og sender behandlingUuid som skalar', async () => {
    const verge: VergeDto = {
      navn: 'Advokat Nordmann',
      organisasjonsnummer: '974760673',
      vergeType: 'ADVOKAT',
      gyldigFom: '2024-01-01',
      gyldigTom: '2024-12-31',
    };
    vi.mocked(verge_hentVerge).mockResolvedValue({
      data: verge,
      request,
      response: new Response(JSON.stringify(verge), { status: 200 }),
    });

    const resultat = await new UngTilbakeVergeBackendClient().hentVerge('behandling-uuid');

    expect(resultat).toEqual(verge);
    expect(verge_hentVerge).toHaveBeenCalledWith({ query: { behandlingUuid: 'behandling-uuid' } });
  });

  it('returnerer null ved 204 uten innhold', async () => {
    // Generert klient gir tomt objekt som data ved 204
    vi.mocked(verge_hentVerge).mockResolvedValue({
      data: {},
      request,
      response: new Response(null, { status: 204 }),
    });

    expect(await new UngTilbakeVergeBackendClient().hentVerge('behandling-uuid')).toBeNull();
  });

  it('sender feil fra kallet videre', async () => {
    const feil = new Error('500');
    vi.mocked(verge_hentVerge).mockRejectedValue(feil);

    await expect(new UngTilbakeVergeBackendClient().hentVerge('behandling-uuid')).rejects.toBe(feil);
  });
});
