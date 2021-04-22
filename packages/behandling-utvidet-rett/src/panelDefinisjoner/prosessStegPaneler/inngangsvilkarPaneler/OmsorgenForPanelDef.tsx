import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OmsorgenForMikrofrontend from './omsorgenForMikrofrontend/OmsorgenForMikrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OmsorgenForMikrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMP_OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, soknad }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    fagsaksType: fagsak.sakstype.kode,
  });
}

export default OmsorgenForPanelDef;
