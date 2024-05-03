import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import InnsynProsessIndex from '@k9-sak-web/prosess-innsyn';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <InnsynProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INNSYN];

  getData = ({ innsyn, alleDokumenter, fagsak }) => ({
    innsyn,
    alleDokumenter,
    saksnummer: fagsak.saksnummer,
  });
}

class BehandleInnsynProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEHANDLE_INNSYN;

  getTekstKode = () => 'Behandlingspunkt.Innsyn';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BehandleInnsynProsessStegPanelDef;
