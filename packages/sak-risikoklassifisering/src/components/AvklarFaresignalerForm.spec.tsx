import React from 'react';
import { shallow } from 'enzyme';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { Risikoklassifisering } from '@k9-sak-web/types';

import faresignalVurdering from '../kodeverk/faresignalVurdering';

import {
  AvklarFaresignalerForm,
  begrunnelseFieldName,
  buildInitialValues,
  radioFieldName,
} from './AvklarFaresignalerForm';

const mockAksjonspunkt = (status, begrunnelse) => ({
  definisjon: '5095',
  status: status,
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

const mockRisikoklassifisering = kode => ({
  kontrollresultat: 'HOY',
  faresignalVurdering: kode,
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<AvklarFaresignalerForm>', () => {
  it('skal teste at komponent mountes korrekt med inputfelter', () => {
    const wrapper = shallow(
      <AvklarFaresignalerForm
        readOnly
        aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
        submitCallback={() => undefined}
        risikoklassifisering={{} as Risikoklassifisering}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(TextAreaField)).toHaveLength(1);
    expect(wrapper.find(RadioOption)).toHaveLength(2);
    expect(wrapper.find(RadioGroupField)).toHaveLength(1);
  });

  it('skal teste at komponent gir inputfelter korrekte verdier', () => {
    const wrapper = shallow(
      <AvklarFaresignalerForm
        readOnly
        aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
        submitCallback={() => undefined}
        risikoklassifisering={{} as Risikoklassifisering}
        {...reduxFormPropsMock}
      />,
    );
    const textArea = wrapper.find('TextAreaField');
    expect(textArea.props().readOnly).toBe(true);

    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup.props().readOnly).toBe(true);
    expect(radioGroup.prop('isEdited')).toBe(true);
  });

  it('skal teste at buildInitialValues gir korrekte verdier', () => {
    const expectedInitialValues = {
      [begrunnelseFieldName]: 'Dette er en begrunnelse',
      [radioFieldName]: true,
    };
    const actualValues = buildInitialValues.resultFunc(
      mockRisikoklassifisering(faresignalVurdering.INNVIRKNING),
      mockAksjonspunkt('UTFO', 'Dette er en begrunnelse'),
    );

    expect(actualValues).toEqual(expectedInitialValues);
  });
});
