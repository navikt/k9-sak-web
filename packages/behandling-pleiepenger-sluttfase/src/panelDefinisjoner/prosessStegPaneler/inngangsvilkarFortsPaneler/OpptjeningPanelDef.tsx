import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';

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
