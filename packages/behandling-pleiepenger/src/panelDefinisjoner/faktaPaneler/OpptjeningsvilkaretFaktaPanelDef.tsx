import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OpptjeningFaktaIndex from '@k9-sak-web/fakta-opptjening-oms';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

const erAllePerioderOppfylt = vilkarsperioder =>
  vilkarsperioder.every(periode => periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT);

const shouldShowOpptjening = vilkar =>
  vilkar.some(v => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET) &&
  vilkar.some(v => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && erAllePerioderOppfylt(v.perioder));

class OpptjeningsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPTJENINGSVILKARET;

  getTekstKode = () => 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.OPPTJENING];

  getKomponent = props => <OpptjeningFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ vilkar }) => shouldShowOpptjening(vilkar);
}

export default OpptjeningsvilkaretFaktaPanelDef;
