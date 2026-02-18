import type { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';

import { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType';
import lagForhåndsvisRequest, { forhandsvis } from '@fpsak-frontend/utils/src/formidlingUtils';
import { K9sakApiKeys, restApiHooks } from './k9sakApi';

type ForhandsvisFunksjon = (erHenleggelse: boolean, data: any) => Promise<void>;

export const useVisForhandsvisningAvMelding = (behandling: BehandlingInfo, fagsak?: Fagsak): ForhandsvisFunksjon => {
  const erTilbakekreving = erTilbakekrevingType(behandling?.type);

  if (!erTilbakekreving && !fagsak) {
    throw new Error('Fagsak er påkrevd ved forhåndvisning mot formidling');
  }

  const { startRequest: forhandsvisTilbakekrevingHenleggelse } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
  );
  const { startRequest: forhandsvisTilbakekreving } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING,
  );

  const { startRequest: forhandsvisMelding } = restApiHooks.useRestApiRunner(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING);

  return async (erHenleggelse: boolean, data: any): Promise<void> => {
    if (erTilbakekreving && erHenleggelse) {
      const response = await forhandsvisTilbakekrevingHenleggelse({ behandlingUuid: behandling.uuid, ...data });
      forhandsvis(response);
    } else if (erTilbakekreving) {
      const response = await forhandsvisTilbakekreving({ behandlingUuid: behandling.uuid, ...data });
      forhandsvis(response);
    } else {
      const req = { ...lagForhåndsvisRequest(behandling, fagsak, fagsak.person, data) };
      const response = await forhandsvisMelding(req);
      forhandsvis(response);
    }
  };
};

export default useVisForhandsvisningAvMelding;
