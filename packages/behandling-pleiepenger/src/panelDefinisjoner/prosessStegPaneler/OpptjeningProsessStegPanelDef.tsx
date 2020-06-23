import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OpptjeningVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSPERIODE, vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [pleiepengerBehandlingApi.OPPTJENING];

  getData = ({ vilkarForSteg }) => ({
    lovReferanse: vilkarForSteg[0].lovReferanse,
  });

  getOverstyringspanelDef = () =>
    new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET);
}

class OpptjeningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPTJENING;

  getTekstKode = () => 'Behandlingspunkt.Opptjening';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default OpptjeningProsessStegPanelDef;
