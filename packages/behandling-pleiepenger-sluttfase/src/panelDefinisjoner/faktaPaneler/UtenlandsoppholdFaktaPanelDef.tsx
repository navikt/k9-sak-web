import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import Utenlandsopphold from '@k9-sak-web/fakta-utenlandsopphold';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = props => (
    <Utenlandsopphold
      utenlandsopphold={props.utenlandsopphold}
      fagsakYtelseType={fagsakYtelseType.PLEIEPENGER_SLUTTFASE}
    />
  );

  skalVisePanel = () => true;
}

export default UtenlandsoppholdFaktaPanelDef;
