import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening-oms';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

const erAllePerioderOppfylt = vilkarsperioder =>
  vilkarsperioder.every(periode => periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT);

const shouldShowOpptjening = vilkar =>
  vilkar.some(v => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET) &&
  vilkar.some(v => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && erAllePerioderOppfylt(v.perioder));

class OpptjeningsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPTJENINGSVILKARET;

  getTekstKode = () => 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OPPTJENING];

  getKomponent = props => <OpptjeningFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ vilkar }) => shouldShowOpptjening(vilkar);
}

export default OpptjeningsvilkaretFaktaPanelDef;
