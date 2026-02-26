import { client } from '@navikt/ung-tilbake-typescript-client/client';
import { aksjonspunkt_bekreft } from './generated/sdk.js';
import type { BekreftetAksjonspunktDto } from './kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';

/**
 * Klient for å bekrefte aksjonspunkter mot ung-tilbake-backend.
 *
 * Brukes sammen med `useBekreftAksjonspunkt`-hooken via `BehandlingProvider`.
 */
export const ungTilbakeAksjonspunktClient = {
  bekreft: (aksjonspunkter: BekreftetAksjonspunktDto[], behandling: { id: number; versjon: number; uuid: string }) =>
    aksjonspunkt_bekreft({
      body: {
        behandlingUuid: behandling.uuid,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: aksjonspunkter,
      },
    }),

  poll: async (url: string, signal?: AbortSignal) => {
    const parsed = new URL(url);
    let path = parsed.pathname + parsed.search;
    const { baseUrl } = client.getConfig();
    if (baseUrl && path.startsWith(baseUrl)) {
      path = path.slice(baseUrl.length);
    }
    return client.get({ url: path, signal, throwOnError: true });
  },
};
