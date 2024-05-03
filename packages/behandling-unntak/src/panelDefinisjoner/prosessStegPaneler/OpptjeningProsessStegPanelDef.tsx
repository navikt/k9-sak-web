import React from 'react';

import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import OpptjeningVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-opptjening-oms';

import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OpptjeningVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [UnntakBehandlingApiKeys.OPPTJENING];

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
