import { dokumentdatatype } from '@k9-sak-web/konstanter';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { finnesTilgjengeligeVedtaksbrev, kanHaManueltFritekstbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

function lagDokumentdata(aksjonspunktModell) {
  if (
    aksjonspunktModell.tilgjengeligeVedtaksbrev &&
    !finnesTilgjengeligeVedtaksbrev(aksjonspunktModell.tilgjengeligeVedtaksbrev)
  )
    return null;

  const vedtaksbrevmaler = aksjonspunktModell.tilgjengeligeVedtaksbrev?.vedtaksbrevmaler;

  if (aksjonspunktModell.skalUndertrykkeBrev) {
    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN,
      [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.INGEN],
    };
  }
  if (aksjonspunktModell.skalBrukeOverstyrendeFritekstBrev) {
    if (kanHaManueltFritekstbrev(aksjonspunktModell.tilgjengeligeVedtaksbrev)) {
      return {
        [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.MANUELL,
        [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.MANUELL],
        [dokumentdatatype.REDIGERTBREV]: {},
        ...(aksjonspunktModell.overstyrtMottaker
          ? { [dokumentdatatype.OVERSTYRT_MOTTAKER]: aksjonspunktModell.overstyrtMottaker }
          : {}),
      };
    }

    return {
      [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
      [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.FRITEKST],
      [dokumentdatatype.FRITEKSTBREV]: {
        brødtekst: aksjonspunktModell.fritekstbrev?.brødtekst,
        overskrift: aksjonspunktModell.fritekstbrev?.overskrift,
        inkluderKalender: aksjonspunktModell.fritekstbrev?.inkluderKalender,
      },
      ...(aksjonspunktModell.overstyrtMottaker
        ? { [dokumentdatatype.OVERSTYRT_MOTTAKER]: aksjonspunktModell.overstyrtMottaker }
        : {}),
    };
  }

  const dokumentdata = {
    [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK,
    [dokumentdatatype.VEDTAKSBREV_MAL]: vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK],
    ...(aksjonspunktModell.overstyrtMottaker
      ? { [dokumentdatatype.OVERSTYRT_MOTTAKER]: aksjonspunktModell.overstyrtMottaker }
      : {}),
  };
  aksjonspunktModell.begrunnelserMedInformasjonsbehov?.forEach(({ kode, begrunnelse }) => {
    dokumentdata[kode] = begrunnelse;
  });
  return dokumentdata;
}

export default lagDokumentdata;
