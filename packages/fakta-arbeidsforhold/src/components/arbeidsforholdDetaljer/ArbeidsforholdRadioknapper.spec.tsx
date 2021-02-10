import React from 'react';
import { RadioOption } from '@fpsak-frontend/form';
import RadioGroupField from '@fpsak-frontend/form/src/RadioGroupField';
import shallowWithIntl, { intlMock } from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';

it('skal vise to radioknapper', () => {
  const wrapper = shallowWithIntl(
    <ArbeidsforholdRadioknapper.WrappedComponent intl={intlMock} formName="" behandlingId={1} behandlingVersjon={1} />,
  );
  expect(wrapper.find(RadioGroupField)).toHaveLength(1);
  const radioOptions = wrapper.find(RadioOption);
  expect(radioOptions).toHaveLength(2);
  expect(radioOptions.get(0).props.label.id).toEqual('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
  expect(radioOptions.get(0).props.disabled).toEqual(false);
  expect(radioOptions.get(1).props.label.id).toEqual('PersonArbeidsforholdDetailForm.FortsettBehandling');
  expect(radioOptions.get(1).props.disabled).toEqual(false);
});
