import React from 'react';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { shallowWithIntl } from '../../i18n';
import { OverforingerFaktaFormImpl } from './OverforingerFaktaForm';
import FormValues from '../types/FormValues';
import Seksjon from './Seksjon';

describe('<OverforingerFaktaFormImpl>', () => {
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
      <OverforingerFaktaFormImpl
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
