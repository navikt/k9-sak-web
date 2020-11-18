import { dokumentdatatype } from '@k9-sak-web/konstanter';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';

function lagDokumentdata(aksjonspunktModell) {
  if (aksjonspunktModell.skalUndertrykkeBrev) {
    return { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN };
  }
  if (aksjonspunktModell.skalBrukeOverstyrendeFritekstBrev) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
      [dokumentdatatype.FRITEKST]: {
        brødtekst: aksjonspunktModell.fritekstBrev,
        overskrift: aksjonspunktModell.overskrift,
      },
    };
  }
  return { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK };
}

export default lagDokumentdata;
