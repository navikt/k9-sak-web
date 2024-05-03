import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import React from 'react';
import { harBarnSoktForRammevedtakOmKroniskSyk } from '../../../utils/utvidetRettHjelpfunksjoner';
import OmsorgenForMikrofrontend from './omsorgenForMikrofrontend/OmsorgenForMikrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OmsorgenForMikrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMP_OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, soknad, rammevedtak, personopplysninger }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    fagsaksType: fagsak.sakstype.kode,
    harBarnSoktForRammevedtakOmKroniskSyk:
      fagsak.sakstype.kode === fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN
        ? harBarnSoktForRammevedtakOmKroniskSyk(personopplysninger?.barnSoktFor || [], rammevedtak?.rammevedtak || [])
        : false,
  });
}

export default OmsorgenForPanelDef;
