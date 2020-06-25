import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

const getVedtakStatus = aksjonspunkter => {
  const harApentAksjonpunkt = aksjonspunkter.some(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  return aksjonspunkter.length === 0 || harApentAksjonpunkt ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakKlageProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ aksjonspunkterForSteg }) =>
    getVedtakStatus(aksjonspunkterForSteg);

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
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
