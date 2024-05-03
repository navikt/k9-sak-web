import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import CheckPersonStatusIndex from '@k9-sak-web/prosess-saksopplysninger';

import { OmsorgspengerBehandlingApiKeys } from '../../data/omsorgspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <CheckPersonStatusIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_PERSONSTATUS];

  getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.MEDLEMSKAP];

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  });
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER;

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SaksopplysningerProsessStegPanelDef;
