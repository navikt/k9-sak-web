import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OmPleietrengende from "../../components/OmPleietrengende";
import {PleiepengerSluttfaseBehandlingApiKeys} from "../../data/pleiepengerSluttfaseBehandlingApi";

class OmPleietrengendeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_PLEIETRENGENDE;

  getTekstKode = () => 'OmPleietrengendeInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OM_PLEIETRENGENDE];

  getOverstyrVisningAvKomponent = () => true;

  getKomponent = props => {
    // eslint-disbable-next-line
    console.log('props', props);
    return <OmPleietrengende {...props} />;}
}

export default OmPleietrengendeFaktaPanelDef;
