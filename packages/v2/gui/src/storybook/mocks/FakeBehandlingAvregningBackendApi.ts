import type { FagsakYtelseType as FagsakYtelseTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/FagsakYtelseType.js';
import type { TilbakekrevingVidereBehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';
import { fakePdf } from './fakePdf';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';
import { fn } from 'storybook/test';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
  bekreftAksjonspunktSjekkHøyEtterbetaling = fn(
    async (behandlingId: number, behandlingVersjon: number, begrunnelse: string): Promise<void> => {
      ignoreUnusedDeclared(behandlingId);
      ignoreUnusedDeclared(behandlingVersjon);
      ignoreUnusedDeclared(begrunnelse);
      return Promise.resolve();
    },
  );

  bekreftAksjonspunktVurderFeilutbetaling = fn(
    async (
      behandlingId: number,
      behandlingVersjon: number,
      begrunnelse: string,
      videreBehandling: TilbakekrevingVidereBehandlingType,
      varseltekst?: string,
    ): Promise<void> => {
      ignoreUnusedDeclared(behandlingId);
      ignoreUnusedDeclared(behandlingVersjon);
      ignoreUnusedDeclared(begrunnelse);
      ignoreUnusedDeclared(videreBehandling);
      ignoreUnusedDeclared(varseltekst);
      return Promise.resolve();
    },
  );

  hentForhåndsvisningVarselbrev = fn(
    async (
      behandlingUuid: string,
      fagsakYtelseType: FagsakYtelseTypeK9Tilbake,
      varseltekst?: string,
    ): Promise<Blob> => {
      ignoreUnusedDeclared(behandlingUuid);
      ignoreUnusedDeclared(fagsakYtelseType);
      ignoreUnusedDeclared(varseltekst);
      return Promise.resolve(fakePdf());
    },
  );
}
