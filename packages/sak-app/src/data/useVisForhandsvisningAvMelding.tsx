import { Kodeverk } from '@k9-sak-web/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { K9sakApiKeys, restApiHooks } from './k9sakApi';

type ForhandsvisFunksjon = (erHenleggelse: boolean, data: any) => void;

const forhandsvis = (data: any) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

const useVisForhandsvisningAvMelding = (behandlingType?: Kodeverk): ForhandsvisFunksjon => {
  const { startRequest: forhandsvisTilbakekrevingHenleggelse } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
  );
  const { startRequest: forhandsvisTilbakekreving } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING,
  );
  const { startRequest: forhandsvisMelding } = restApiHooks.useRestApiRunner(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING);

  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandlingType?.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType?.kode;

  return (erHenleggelse: boolean, data: any): void => {
    if (erTilbakekreving && erHenleggelse) {
      forhandsvisTilbakekrevingHenleggelse(data).then(response => forhandsvis(response));
    } else if (erTilbakekreving) {
      forhandsvisTilbakekreving(data).then(response => forhandsvis(response));
    } else {
      forhandsvisMelding(data).then(response => forhandsvis(response));
    }
  };
};

export default useVisForhandsvisningAvMelding;
