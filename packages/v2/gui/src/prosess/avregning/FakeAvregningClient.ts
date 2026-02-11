import type { foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType';
import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import { fakePdf } from '../../storybook/mocks/fakePdf';
import { ignoreUnusedDeclared } from '../../storybook/mocks/ignoreUnusedDeclared';

export default class FakeAvregningBackendClient implements BehandlingAvregningBackendApiType {
  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    ignoreUnusedDeclared(behandlingId);
    ignoreUnusedDeclared(behandlingVersjon);
    ignoreUnusedDeclared(begrunnelse);
    return Promise.resolve();
  }

  async bekreftAksjonspunktVurderFeilutbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
    videreBehandling: TilbakekrevingVidereBehandling,
    varseltekst?: string,
  ): Promise<void> {
    ignoreUnusedDeclared(behandlingId);
    ignoreUnusedDeclared(behandlingVersjon);
    ignoreUnusedDeclared(begrunnelse);
    ignoreUnusedDeclared(videreBehandling);
    ignoreUnusedDeclared(varseltekst);
    return Promise.resolve();
  }

  async hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob> {
    ignoreUnusedDeclared(behandlingUuid);
    ignoreUnusedDeclared(fagsakYtelseType);
    ignoreUnusedDeclared(varseltekst);
    return Promise.resolve(fakePdf());
  }
}
