import React from 'react';
import { expect } from 'chai';
import { RadioOption } from '@fpsak-frontend/form';
import shallowWithIntl from '../../../i18n';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';

it('skal vise to radioknapper', () => {
  const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper formName="" behandlingId={1} behandlingVersjon={1} />);
  expect(wrapper.find("[name='arbeidsforholdHandlingField']")).has.length(1);
  const radioOptions = wrapper.find(RadioOption);
  expect(radioOptions).has.length(2);
  expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
  expect(radioOptions.get(0).props.disabled).to.eql(false);
  expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FortsettBehandling');
  expect(radioOptions.get(1).props.disabled).to.eql(false);
});
