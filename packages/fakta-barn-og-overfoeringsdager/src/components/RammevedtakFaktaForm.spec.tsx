import React from 'react';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallowWithIntl } from '../../i18n';
import { RammevedtakFaktaFormImpl } from './RammevedtakFaktaForm';
import FormValues from '../types/FormValues';
import Seksjon from './Seksjon';

describe('<RammevedtakFaktaFormImpl>', () => {
  const formValues: FormValues = {
    fordelingFår: [],
    fordelingGir: [],
    koronaoverføringFår: [],
    koronaoverføringGir: [],
    overføringFår: [],
    overføringGir: [],
  };

  it('rendrer overføringer seksjon', () => {
    const wrapper = shallowWithIntl(
      <RammevedtakFaktaFormImpl
        {...reduxFormPropsMock}
        formValues={formValues}
        rammevedtak={[]}
        behandlingId={1}
        behandlingVersjon={2}
      />,
    );

    expect(wrapper.find(Seksjon)).toHaveLength(1);
  });
});
