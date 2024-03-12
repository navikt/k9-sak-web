import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Fagsak, Personopplysninger, Rammevedtak, Soknad } from '@k9-sak-web/types';

import OmsorgenForMikrofrontend from './omsorgenForMikrofrontend/OmsorgenForMikrofrontend';
import { harBarnSoktForRammevedtakOmKroniskSyk } from '../../../utils/utvidetRettHjelpfunksjoner';
import { UtvidetRettSoknad } from '../../../types/UtvidetRettSoknad';

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
    soknad: UtvidetRettSoknad;
    rammevedtak: { rammevedtak: Rammevedtak[] };
    personopplysninger: Personopplysninger;
  }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    fagsaksType: fagsak.sakstype,
    harBarnSoktForRammevedtakOmKroniskSyk:
      fagsak.sakstype === fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN
        ? harBarnSoktForRammevedtakOmKroniskSyk(personopplysninger?.barnSoktFor || [], rammevedtak?.rammevedtak || [])
        : false,
  });
}

export default OmsorgenForPanelDef;
