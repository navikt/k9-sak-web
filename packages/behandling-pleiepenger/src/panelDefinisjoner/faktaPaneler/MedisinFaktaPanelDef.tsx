import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar/src/MedisinskVilkarIndex';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../../data/pleiepengerBehandlingApi';

class MedisinFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [pleiepengerBehandlingApi.SYKDOM];

  getKomponent = props => <MedisinskVilkarIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }) => fagsak.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER;
}

export default MedisinFaktaPanelDef;
