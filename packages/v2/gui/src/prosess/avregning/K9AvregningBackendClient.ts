import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/combined/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import { dokument_hentForhåndsvisningVarselbrev } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import { FagsakYtelseType as FagsakYtelseTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/FagsakYtelseType.js';
import { isValueOfConstObject } from '@k9-sak-web/backend/typecheck/isValueOfConstObject.js';
import { sammenstiltBackendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';

export class K9AvregningBackendClient implements BehandlingAvregningBackendApiType {
  readonly backend = sammenstiltBackendNavn.k9;

  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    const body: BekreftedeAksjonspunkterDto = {
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

  async bekreftAksjonspunktVurderFeilutbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
    videreBehandling: TilbakekrevingVidereBehandling,
    varseltekst?: string,
  ): Promise<void> {
    const body: BekreftedeAksjonspunkterDto = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
          begrunnelse,
          videreBehandling,
          varseltekst,
        },
      ],
    };
    await aksjonspunkt_bekreft({ body });
  }

  async hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob> {
    if (!isValueOfConstObject(fagsakYtelseType, FagsakYtelseTypeK9Tilbake)) {
      throw new Error(`Utviklerfeil: Ugyldig fagsak ytelse type for k9-tilbake: ${fagsakYtelseType}`);
    }
    return (
      await dokument_hentForhåndsvisningVarselbrev({
        body: { behandlingUuid, fagsakYtelseType, varseltekst },
      })
    ).data as Blob;
  }
}
