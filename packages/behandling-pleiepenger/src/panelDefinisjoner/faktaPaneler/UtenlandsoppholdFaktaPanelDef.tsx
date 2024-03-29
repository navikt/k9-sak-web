import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import Utenlandsopphold from '@k9-sak-web/fakta-utenlandsopphold';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = props => (
    <Utenlandsopphold
      utenlandsopphold={props.utenlandsopphold}
      kodeverk={props.alleKodeverk}
      fagsakYtelseType={fagsakYtelseType.PLEIEPENGER}
    />
  );

  skalVisePanel = () => true;
}

export default UtenlandsoppholdFaktaPanelDef;
