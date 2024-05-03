import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import AnkeProsessIndex from '@k9-sak-web/prosess-anke';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AnkeProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ alleBehandlinger, ankeVurdering, saveAnke, previewCallback }) => ({
    behandlinger: alleBehandlinger,
    previewVedtakCallback: previewCallback,
    ankeVurdering,
    saveAnke,
    previewCallback,
  });
}

class AnkeBehandlingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.ANKEBEHANDLING;

  getTekstKode = () => 'Behandlingspunkt.Ankebehandling';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default AnkeBehandlingProsessStegPanelDef;
