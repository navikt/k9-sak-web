import React from 'react';

import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

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
