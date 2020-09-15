import React from 'react';
import { expect } from 'chai';
import { RadioOption } from '@fpsak-frontend/form/index';
import { shallowWithIntl } from '../../i18n';
import Spørsmål from './Spørsmål';

it('rendres ikke hvis vis er falsy', () => {
  const wrapper = shallowWithIntl(
    <Spørsmål vis={false} feltnavn="test" labeldId="testId" nullstillFelt={() => undefined} />,
  );

  expect(wrapper.instance()).to.equal(null);
});

it('viser pil til det svaret som er valgt', () => {
  const wrapper = shallowWithIntl(
    <Spørsmål vis feltnavn="test" labeldId="testId" nullstillFelt={() => undefined} value />,
  );

  const optionJa = wrapper.find(RadioOption).findWhere(option => option.prop('value') === true);

  expect(optionJa.prop('wrapperClassName')).to.contain('erValgt');
});
