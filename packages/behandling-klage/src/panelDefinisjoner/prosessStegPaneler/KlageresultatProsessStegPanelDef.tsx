import React from 'react';

import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakKlageProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
  ];

  getData = ({ previewCallback, klageVurdering, valgtPartMedKlagerett }) => ({
    previewVedtakCallback: previewCallback,
    klageVurdering,
    valgtPartMedKlagerett,
  });
}

class KlageresultatProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_RESULTAT;

  getTekstKode = () => 'Behandlingspunkt.ResultatKlage';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default KlageresultatProsessStegPanelDef;
