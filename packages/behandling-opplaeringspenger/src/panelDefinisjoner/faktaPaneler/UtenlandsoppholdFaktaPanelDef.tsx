import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import Utenlandsopphold from '@k9-sak-web/behandling-opplaeringspenger/src/components/Utenlandsopphold';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = props => <Utenlandsopphold utenlandsopphold={props.utenlandsopphold} kodeverk={props.alleKodeverk} />;

  skalVisePanel = (apCodes, data, featureToggles) => featureToggles?.UTENLANDSOPPHOLD;
}

export default UtenlandsoppholdFaktaPanelDef;
