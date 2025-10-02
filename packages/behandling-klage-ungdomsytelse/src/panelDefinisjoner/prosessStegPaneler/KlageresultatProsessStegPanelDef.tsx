import React from 'react';

import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakKlageProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ behandling }) => (behandling.avsluttet ? vilkarUtfallType.OPPFYLT : null);

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_DOKUMENT,
  ];

  getData = ({ previewCallback, klageVurdering }) => ({
    previewVedtakCallback: previewCallback,
    klageVurdering,
  });
}

class KlageresultatProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_RESULTAT;

  getTekstKode = () => 'Behandlingspunkt.ResultatKlage';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default KlageresultatProsessStegPanelDef;
