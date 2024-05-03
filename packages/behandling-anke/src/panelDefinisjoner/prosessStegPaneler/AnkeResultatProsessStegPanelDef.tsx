import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import AnkeResultatProsessIndex from '@k9-sak-web/prosess-anke-resultat';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AnkeResultatProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
  ];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ ankeVurdering, saveAnke, previewCallback, hentFritekstbrevHtmlCallback }) => ({
    previewVedtakCallback: previewCallback,
    previewCallback,
    hentFritekstbrevHtmlCallback,
    ankeVurdering,
    saveAnke,
  });
}

class AnkeResultatProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.ANKE_RESULTAT;

  getTekstKode = () => 'Behandlingspunkt.AnkeResultat';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default AnkeResultatProsessStegPanelDef;
