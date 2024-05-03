import { object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import BostedSokerFaktaIndex from '@k9-sak-web/fakta-bosted-soker';
import landkoder from '@k9-sak-web/kodeverk/src/landkoder';
import opplysningAdresseType from '@k9-sak-web/kodeverk/src/opplysningAdresseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import region from '@k9-sak-web/kodeverk/src/region';
import sivilstandType from '@k9-sak-web/kodeverk/src/sivilstandType';

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
  decorators: [withKnobs],
};

export const visPanelForInformasjonOmSøkersBosted = () => (
  <div style={{ padding: '50px' }}>
    <BostedSokerFaktaIndex
      personopplysninger={object('personopplysninger', personopplysninger)}
      alleKodeverk={alleKodeverk}
    />
  </div>
);
