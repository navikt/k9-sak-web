import {
  aksjonspunkt_bekreft,
  simulering_hentSimuleringResultat,
  tilbakekrevingsvalg_hentTilbakekrevingValg,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType';

export default class BehandlingAvregningBackendClient implements BehandlingAvregningBackendApiType {
  readonly backend = 'k9';

  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    const body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
          begrunnelse,
        },
      ],
    };
    await aksjonspunkt_bekreft({ body });
  }

  async hentSimuleringResultat(behandlingUuid: string) {
    return (await simulering_hentSimuleringResultat({ query: { behandlingUuid } })).data;
  }

  async hentTilbakekrevingValg(behandlingUuid: string) {
    return (await tilbakekrevingsvalg_hentTilbakekrevingValg({ query: { behandlingUuid } })).data;
  }
}
