import React from 'react';

import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import unntakBehandlingApi from '../../data/unntakBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <CheckPersonStatusIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_PERSONSTATUS];

  getEndepunkter = () => [unntakBehandlingApi.MEDLEMSKAP];

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  });
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER;

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SaksopplysningerProsessStegPanelDef;
