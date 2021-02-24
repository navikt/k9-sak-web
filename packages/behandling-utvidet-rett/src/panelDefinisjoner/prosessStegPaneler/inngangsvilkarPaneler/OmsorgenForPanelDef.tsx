import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import OmsorgenForMicrofrontend from './omsorgenForMicrofrontend/OmsorgenForMicrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OmsorgenForMicrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getData = ({ soknad, vilkar }) => {
    return {
      angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
      vilkar,
    };
  };
}

export default OmsorgenForPanelDef;
