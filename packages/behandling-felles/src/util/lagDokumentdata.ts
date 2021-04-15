import { dokumentdatatype } from '@k9-sak-web/konstanter';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { finnesTilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';

function lagDokumentdata(aksjonspunktModell) {
  if (
    aksjonspunktModell.tilgjengeligeVedtaksbrev &&
    !finnesTilgjengeligeVedtaksbrev(aksjonspunktModell.tilgjengeligeVedtaksbrev)
  ) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: null,
      [dokumentdatatype.VEDTAKSBREV_MAL]: null,
    };
  }

  const vedtaksbrevmaler = aksjonspunktModell.tilgjengeligeVedtaksbrev?.vedtaksbrevmaler;

  if (aksjonspunktModell.skalUndertrykkeBrev) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN,
      [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.INGEN],
    };
  }
  if (aksjonspunktModell.skalBrukeOverstyrendeFritekstBrev) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
      [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.FRITEKST],
      [dokumentdatatype.FRITEKSTBREV]: {
        brødtekst: aksjonspunktModell.fritekstbrev?.brødtekst,
        overskrift: aksjonspunktModell.fritekstbrev?.overskrift,
      },
      ...(aksjonspunktModell.overstyrtMottaker
        ? { [dokumentdatatype.OVERSTYRT_MOTTAKER]: aksjonspunktModell.overstyrtMottaker }
        : {}),
    };
  }
  return {
    [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK,
    [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK],
    ...(aksjonspunktModell.overstyrtMottaker
      ? { [dokumentdatatype.OVERSTYRT_MOTTAKER]: aksjonspunktModell.overstyrtMottaker }
      : {}),
  };
}

export default lagDokumentdata;
