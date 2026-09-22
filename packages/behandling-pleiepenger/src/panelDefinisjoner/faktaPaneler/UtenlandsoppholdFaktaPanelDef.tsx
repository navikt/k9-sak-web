import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import UtenlandsoppholdFaktaIndex from '@k9-sak-web/gui/fakta/utenlandsopphold/UtenlandsoppholdFaktaIndex.js';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getKomponent = props => (
    <UtenlandsoppholdFaktaIndex
      behandlingUuid={props.behandling.uuid}
      fagsakYtelseType={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
    />
  );

  skalVisePanel = () => true;
}

export default UtenlandsoppholdFaktaPanelDef;
