import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallowWithIntl } from '../../i18n/shallowWithIntl';
import { RammevedtakFaktaFormImpl } from './RammevedtakFaktaForm';
import FormValues from '../types/FormValues';
import Seksjon from './Seksjon';

describe('<RammevedtakFaktaFormImpl>', () => {
  const formValues: FormValues = {
    barn: [],
    fordelingFår: [],
    fordelingGir: [],
    koronaoverføringFår: [],
    koronaoverføringGir: [],
    overføringFår: [],
    overføringGir: [],
  };

  it('rendrer barn, overføringer og midlertidig aleneansvar-seksjoner', () => {
    const wrapper = shallowWithIntl(
      <RammevedtakFaktaFormImpl {...reduxFormPropsMock} formValues={formValues} rammevedtak={[]} />,
    );

    expect(wrapper.find(Seksjon)).to.have.length(3);
  });
});
