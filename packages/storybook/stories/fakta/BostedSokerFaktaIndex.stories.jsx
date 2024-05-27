import React from 'react';

import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';

import alleKodeverk from '../mocks/alleKodeverk.json';

const personopplysninger = {
  navn: 'Espen Utvikler',
  adresser: [
    {
      adresseType: {
        kode: opplysningAdresseType.BOSTEDSADRESSE,
      },
      adresselinje1: 'Sentrum',
      adresselinje2: '1010',
      adresselinje3: 'Oslo',
      land: landkoder.NORGE,
    },
  ],
  sivilstand: {
    kode: sivilstandType.UOPPGITT,
    kodeverk: 'SIVILSTAND_TYPE',
  },
  region: {
    kode: region.NORDEN,
    kodeverk: 'REGION',
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
};

export default {
  title: 'fakta/fakta-bosted-soker',
  component: BostedSokerFaktaIndex,
};

export const visPanelForInformasjonOmSøkersBosted = args => (
  <div style={{ padding: '50px' }}>
    <BostedSokerFaktaIndex alleKodeverk={alleKodeverk} {...args} />
  </div>
);

visPanelForInformasjonOmSøkersBosted.args = {
  personopplysninger,
};
