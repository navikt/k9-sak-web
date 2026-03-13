import { client } from '@navikt/ung-sak-typescript-client/client';
import { aksjonspunkt_bekreft } from './generated/sdk.js';
import type { BekreftetAksjonspunktDto } from './kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftAksjonspunktClient } from '@k9-sak-web/gui/shared/hooks/useBekreftAksjonspunkt.js';

export const ungSakAksjonspunktClient = {
  bekreft: (aksjonspunkter: BekreftetAksjonspunktDto[], behandling: { id: number; versjon: number; uuid: string }) =>
    aksjonspunkt_bekreft({
      body: {
        behandlingId: `${behandling.id}`,
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
} satisfies BekreftAksjonspunktClient<BekreftetAksjonspunktDto>;
