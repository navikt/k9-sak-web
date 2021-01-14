import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { PleiepengerBehandlingApiKeys } from '../../../data/pleiepengerBehandlingApi';

class VurderSoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'VURDER_SOKNADSFRIST';

  getTekstKode = () => 'Inngangsvilkar.Opptjeningsvilkaret';

  getKomponent = props => <VurderSoknadsfristForeldrepengerIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.UTTAK_PERIODE_GRENSE];

  getData = ({ soknad }) => ({ soknad });
}

export default VurderSoknadsfristPanelDef;
