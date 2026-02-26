import { client } from '@navikt/k9-sak-typescript-client/client';
import { aksjonspunkt_bekreft } from './generated/sdk.js';
import type { BekreftetAksjonspunktDto } from './kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';

/**
 * Klient for å bekrefte aksjonspunkter mot k9-sak-backend.
 *
 * Brukes sammen med `useBekreftAksjonspunkt`-hooken via `BehandlingProvider`.
 */
export const k9SakAksjonspunktClient = {
  bekreft: (aksjonspunkter: BekreftetAksjonspunktDto[], behandling: { id: number; versjon: number; uuid: string }) =>
    aksjonspunkt_bekreft({
      body: {
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: aksjonspunkter,
      },
    }),

  poll: async (url: string, signal?: AbortSignal) => {
    // Location-header inneholder full absolutt URL.
    // Stripper origin og baseUrl slik at klienten bruker riktig relativ path.
    const parsed = new URL(url);
    let path = parsed.pathname + parsed.search;
    const { baseUrl } = client.getConfig();
    if (baseUrl && path.startsWith(baseUrl)) {
      path = path.slice(baseUrl.length);
    }
    return client.get({ url: path, signal, throwOnError: true });
  },
};
