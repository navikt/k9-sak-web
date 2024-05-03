import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-opptjening-oms';

import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { PleiepengerBehandlingApiKeys } from '../../../data/pleiepengerBehandlingApi';

class OpptjeningPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OpptjeningVilkarProsessIndex {...props} />;

  getTekstKode = () => 'Behandlingspunkt.Opptjening';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.OPPTJENING];

  getData = ({ fagsak, vilkarForSteg }) => ({
    fagsak,
    lovReferanse: vilkarForSteg[0].lovReferanse,
  });

  getOverstyringspanelDef = () =>
    new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET);
}

export default OpptjeningPanelDef;
