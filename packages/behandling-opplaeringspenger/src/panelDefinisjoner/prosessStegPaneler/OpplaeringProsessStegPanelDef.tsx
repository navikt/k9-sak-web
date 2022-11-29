import React from 'react';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import OpplaeringIndex from '@k9-sak-web/prosess-opplaering';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OpplaeringIndex />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, previewFptilbakeCallback, simuleringResultat }) => ({
    fagsak,
    previewFptilbakeCallback,
    simuleringResultat,
  });
}

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default OpplaeringProsessStegPanelDef;
