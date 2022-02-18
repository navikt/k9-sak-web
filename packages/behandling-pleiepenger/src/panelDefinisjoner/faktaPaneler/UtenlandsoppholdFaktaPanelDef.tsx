import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import Utenlandsopphold from '@k9-sak-web/behandling-pleiepenger/src/components/Utenlandsopphold';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = ({utenlandsopphold}) => <Utenlandsopphold utenlandsopphold={utenlandsopphold} />;

  skalVisePanel = () => true
}

export default UtenlandsoppholdFaktaPanelDef;
