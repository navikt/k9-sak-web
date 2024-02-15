import React from 'react';

import { shallow } from 'enzyme';

import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import BostedSokerFaktaIndex, { BostedSokerPersonopplysninger } from './BostedSokerFaktaIndex';
import BostedSokerView from './components/BostedSokerView';

describe('<BostedSokerFaktaIndex>', () => {
  it('vise rendre komponent korrekt', () => {
    const wrapper = shallow(
      <BostedSokerFaktaIndex
        personopplysninger={
          {
            navn: 'Espen Utvikler',
            adresser: [
              {
                adresseType: {
                  kode: opplysningAdresseType.BOSTEDSADRESSE,
                },
              },
            ],
            personstatus: {
              kode: personstatusType.BOSATT,
            },
          } as BostedSokerPersonopplysninger
        }
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(BostedSokerView)).has.length(1);
  });
});
