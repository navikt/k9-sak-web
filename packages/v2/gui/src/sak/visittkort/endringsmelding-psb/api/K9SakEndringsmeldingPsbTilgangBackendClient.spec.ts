import { fagsak_hentEndringsmeldingPsbTilgang } from '@k9-sak-web/backend/k9sak/sdk/EndringsmeldingPsbTilgangSdk.js';
import { describe, expect, it, vi } from 'vitest';
import { K9SakEndringsmeldingPsbTilgangBackendClient } from './K9SakEndringsmeldingPsbTilgangBackendClient.js';

vi.mock('@k9-sak-web/backend/k9sak/sdk/EndringsmeldingPsbTilgangSdk.js', () => ({
  fagsak_hentEndringsmeldingPsbTilgang: vi.fn(),
}));

const request = new Request('http://localhost/k9/sak/api/fagsak/endringsmelding-psb/tilgang');

describe('K9SakEndringsmeldingPsbTilgangBackendClient', () => {
  it('returnerer null ved 204 uten innhold', async () => {
    vi.mocked(fagsak_hentEndringsmeldingPsbTilgang).mockResolvedValue({
      // @ts-expect-error Generert klient gir tomt objekt som data ved 204, selv om typen sier void
      data: {},
      request,
      response: new Response(null, { status: 204 }),
    });

    const resultat = await new K9SakEndringsmeldingPsbTilgangBackendClient().hentEndringsmeldingPsbTilgang('5YD0i');

    expect(resultat).toBeNull();
  });
});
