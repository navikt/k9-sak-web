import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import OmsorgenForMikrofrontend from './omsorgenForMikrofrontend/OmsorgenForMikrofrontend';
import { harBarnSoktForRammevedtakOmKroniskSyk } from '../../../utils/utvidetRettHjelpfunksjoner';
import { Fagsak } from '@k9-sak-web/types';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <OmsorgenForMikrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMP_OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({
    fagsak,
    soknad,
    rammevedtak,
    personopplysninger,
  }: {
    fagsak: Fagsak;
    soknad;
    rammevedtak;
    personopplysninger;
  }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    fagsaksType: fagsak.sakstype,
    harBarnSoktForRammevedtakOmKroniskSyk:
      fagsak.sakstype === fagsakYtelsesType.OMSORGSPENGER_KS
        ? harBarnSoktForRammevedtakOmKroniskSyk(personopplysninger?.barnSoktFor || [], rammevedtak?.rammevedtak || [])
        : false,
  });
}

export default OmsorgenForPanelDef;
