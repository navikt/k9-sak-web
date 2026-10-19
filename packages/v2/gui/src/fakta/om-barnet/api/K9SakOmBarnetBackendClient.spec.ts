import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import { død_hentVurderingRettPleiepengerVedDød } from '@k9-sak-web/backend/k9sak/sdk/OmBarnetSdk.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { K9SakOmBarnetBackendClient } from './K9SakOmBarnetBackendClient.js';

vi.mock('@k9-sak-web/backend/k9sak/sdk/OmBarnetSdk.js', () => ({
  død_hentVurderingRettPleiepengerVedDød: vi.fn(),
}));

const request = new Request('http://localhost/k9/sak/api/behandling/pleietrengende/dod');

describe('K9SakOmBarnetBackendClient', () => {
  beforeEach(() => {
    vi.mocked(død_hentVurderingRettPleiepengerVedDød).mockReset();
  });

  it('returnerer lagret vurdering ved 200', async () => {
    const vurdering: VurderingRettPleiepengerVedDødDto = {
      rettVedDødType: 'RETT_6_UKER',
      vurdering: 'Vurdering',
      vurdertAv: 'Z123456',
      vurdertTidspunkt: '2025-04-02T10:15:00',
    };
    vi.mocked(død_hentVurderingRettPleiepengerVedDød).mockResolvedValue({
      data: vurdering,
      request,
      response: new Response(JSON.stringify(vurdering), { status: 200 }),
    });

    const resultat = await new K9SakOmBarnetBackendClient().hentRettVedDød('behandling-uuid');

    expect(resultat).toEqual(vurdering);
    expect(død_hentVurderingRettPleiepengerVedDød).toHaveBeenCalledWith({
      query: { behandlingUuid: 'behandling-uuid' },
    });
  });

  it('returnerer null ved 204 uten innhold', async () => {
    // Generert klient gir tomt objekt som data ved 204
    vi.mocked(død_hentVurderingRettPleiepengerVedDød).mockResolvedValue({
      data: {},
      request,
      response: new Response(null, { status: 204 }),
    });

    const resultat = await new K9SakOmBarnetBackendClient().hentRettVedDød('behandling-uuid');

    expect(resultat).toBeNull();
  });

  it('feiler når 200 mangler innhold', async () => {
    vi.mocked(død_hentVurderingRettPleiepengerVedDød).mockResolvedValue({
      data: undefined,
      request,
      response: new Response(null, { status: 200 }),
    });

    await expect(new K9SakOmBarnetBackendClient().hentRettVedDød('behandling-uuid')).rejects.toThrow(
      'Uventet svar fra rett ved død (200)',
    );
  });

  it.each([404, 500])('sender feil videre ved %i i stedet for å returnere null', async status => {
    const feil = new ExtendedApiError(request, new Response(null, { status }), 'Feil', null);
    vi.mocked(død_hentVurderingRettPleiepengerVedDød).mockRejectedValue(feil);

    await expect(new K9SakOmBarnetBackendClient().hentRettVedDød('behandling-uuid')).rejects.toBe(feil);
  });
});
