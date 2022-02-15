import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

describe('VedtakRedusertUtbetalingArsaker', () => {
  const vedtakRedusertUtbetalingArsaker = (
    readOnly = false,
    values = new Map(),
    vedtakVarsel = {},
    erSendtInnUtenArsaker = false,
    merkedeArsaker = undefined,
  ) => {
    const attributter = { intl: intlMock, vedtakVarsel, readOnly, values, erSendtInnUtenArsaker, merkedeArsaker };
    return shallow(<VedtakRedusertUtbetalingArsaker {...attributter} />);
  };

  it('Viser avkrysningsboks for hver årsak', () => {
    const expectedLength = Object.keys(redusertUtbetalingArsak).length;
    expect(vedtakRedusertUtbetalingArsaker().children()).to.have.length(expectedLength);
  });

  it('Aktiverer avkrysningsboksene når readOnly er usann', () => {
    const readOnly = false;
    vedtakRedusertUtbetalingArsaker(readOnly)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('disabled')).to.be.false);
  });

  it('Deaktiverer avkrysningsboksene når readOnly er sann', () => {
    const readOnly = true;
    vedtakRedusertUtbetalingArsaker(readOnly)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('disabled')).to.be.true);
  });
});
