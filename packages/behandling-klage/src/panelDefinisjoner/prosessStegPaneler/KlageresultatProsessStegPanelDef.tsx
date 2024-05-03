import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import VedtakKlageProsessIndex from '@k9-sak-web/prosess-vedtak-klage';

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
