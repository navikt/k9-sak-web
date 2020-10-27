import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { intlMock } from "@fpsak-frontend/utils-test/src/intl-enzyme-test-helper";
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

describe('VedtakRedusertUtbetalingArsaker', () => {

  const vedtakRedusertUtbetalingArsaker = (
    readOnly = false,
    values = new Map(),
    vedtakVarsel = {},
    erSendtInnUtenArsaker = false,
    merkedeArsaker = undefined
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

  it('Krysser av i riktige bokser ved skrivemodus', () => {
    const checkedUtbetalingsarsak = Object.values(redusertUtbetalingArsak)[0];
    const values = new Map(Object.values(redusertUtbetalingArsak).map(a => [a, a === checkedUtbetalingsarsak]));
    const readOnly = false;
    const expectedCheckedValue = checkboxField => checkboxField.key() === checkedUtbetalingsarsak;
    vedtakRedusertUtbetalingArsaker(readOnly, values)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('checked')).to.be.equal(expectedCheckedValue(checkboxField)));
  });

  it('Krysser av i riktige bokser ved lesemodus når dokumentdata ikke er hentet', () => {
    const checkedUtbetalingsarsak = Object.values(redusertUtbetalingArsak)[0];
    const vedtakVarsel = { redusertUtbetalingÅrsaker: [checkedUtbetalingsarsak] };
    const readOnly = true;
    const expectedCheckedValue = checkboxField => checkboxField.key() === checkedUtbetalingsarsak;
    vedtakRedusertUtbetalingArsaker(readOnly, undefined, vedtakVarsel)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('checked')).to.be.equal(expectedCheckedValue(checkboxField)));
  });

  it('Krysser av i riktige bokser ved lesemodus når dokumentdata er hentet', () => {
    const checkedUtbetalingsarsak = Object.values(redusertUtbetalingArsak)[0];
    const merkedeArsaker = [checkedUtbetalingsarsak];
    const readOnly = true;
    const expectedCheckedValue = checkboxField => checkboxField.key() === checkedUtbetalingsarsak;
    vedtakRedusertUtbetalingArsaker(readOnly, undefined, undefined, undefined, merkedeArsaker)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('checked')).to.be.equal(expectedCheckedValue(checkboxField)));
  });
});
