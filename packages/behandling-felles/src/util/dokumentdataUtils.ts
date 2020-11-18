import { dokumentdatatype } from '@k9-sak-web/konstanter';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';

function lagDokumentdata(aksjonspunktModels: {}) {
  if (aksjonspunktModels[0].skalUndertrykkeBrev) {
    return { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN };
  }

  if (aksjonspunktModels[0].skalBrukeOverstyrendeFritekstBrev) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
      [dokumentdatatype.FRITEKST]: {
        brødtekst: aksjonspunktModels[0].fritekstBrev,
        overskrift: aksjonspunktModels[0].overskrift,
      },
    };
  }

  return { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK };
}

export default lagDokumentdata;
