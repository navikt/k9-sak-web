import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import OmsorgenForMikrofrontend from './omsorgenForMikrofrontend/OmsorgenForMikrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OmsorgenForMikrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getData = ({ soknad, vilkar, aksjonspunkter }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    vedtakFattetAksjonspunkt: aksjonspunkter.filter(
      aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.FATTER_VEDTAK,
    ),
    vilkar,
  });
}

export default OmsorgenForPanelDef;
