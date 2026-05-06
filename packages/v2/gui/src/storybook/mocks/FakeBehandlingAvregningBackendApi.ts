import type { FagsakYtelseType as FagsakYtelseTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/FagsakYtelseType.js';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';
import { fakePdf } from './fakePdf';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';
import { fn } from 'storybook/test';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
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
