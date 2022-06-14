import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar/src/MedisinskVilkarIndex';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak } from '@k9-sak-web/types';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class MedisinFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.SYKDOM];

  getKomponent = props => <MedisinskVilkarIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype === fagsakYtelseType.PLEIEPENGER;
}

export default MedisinFaktaPanelDef;
