import React from 'react';

import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-opptjening-oms';

import { PleiepengerSluttfaseBehandlingApiKeys } from '../../../data/pleiepengerSluttfaseBehandlingApi';

class OpptjeningPanelDef extends ProsessStegPanelDef {
  getId = () => 'OPPTJENING';

  getTekstKode = () => 'Behandlingspunkt.Opptjening';

  getKomponent = props => <OpptjeningVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OPPTJENING];

  getData = ({ fagsak, vilkarForSteg }) => ({
    fagsak,
    lovReferanse: vilkarForSteg[0].lovReferanse,
  });

  getOverstyringspanelDef = () =>
    new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET);
}

export default OpptjeningPanelDef;
