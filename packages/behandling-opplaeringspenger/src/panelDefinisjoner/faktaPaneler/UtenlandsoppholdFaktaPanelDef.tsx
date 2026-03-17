import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import Utenlandsopphold from '@k9-sak-web/fakta-utenlandsopphold';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import UtenlandsoppholdIndex from '@k9-sak-web/gui/fakta/utenlandsopphold/UtenlandsoppholdIndex.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class UtenlandsoppholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTENLANDSOPPHOLD;

  getTekstKode = () => 'UtenlandsoppholdInfoPanel.Title';

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.UTENLANDSOPPHOLD];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_UTENLANDSOPPHOLD) {
      return (
        <UtenlandsoppholdIndex
          behandlingUuid={props.behandling.uuid}
          fagsakYtelseType={fagsakYtelsesType.OPPLÆRINGSPENGER}
        />
      );
    }
    return (
      <Utenlandsopphold
        utenlandsopphold={props.utenlandsopphold}
        kodeverk={props.alleKodeverk}
        fagsakYtelseType={fagsakYtelsesType.OPPLÆRINGSPENGER}
      />
    );
  };

  skalVisePanel = () => true;
}

export default UtenlandsoppholdFaktaPanelDef;
