import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import Utenlandsopphold from '@k9-sak-web/fakta-utenlandsopphold';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = props => (
    <Utenlandsopphold
      utenlandsopphold={props.utenlandsopphold}
      kodeverk={props.alleKodeverk}
      fagsakYtelseType={fagsakYtelseType.PLEIEPENGER_SLUTTFASE}
    />
  );

  skalVisePanel = () => true;
}

export default UtenlandsoppholdFaktaPanelDef;
