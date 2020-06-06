import React from 'react';
import {expect} from 'chai';
import {shallow} from "enzyme";
import VedtakRedusertUtbetalingArsaker from "./VedtakRedusertUtbetalingArsaker";
import redusertUtbetalingArsak from "../../kodeverk/redusertUtbetalingArsak";

describe('VedtakRedusertUtbetalingArsaker', () => {

  const vedtakRedusertUtbetalingArsaker = (readOnly = false, vedtakVarsel = {}) => {
    const attributter = {vedtakVarsel, readOnly};
    return shallow(<VedtakRedusertUtbetalingArsaker {...attributter}/>);
  };

  it('Viser avkrysningsboks for hver årsak', () => {
    const expectedLength = Object.keys(redusertUtbetalingArsak).length;
    expect(vedtakRedusertUtbetalingArsaker().children()).to.have.length(expectedLength);
  });

  it('Akiverer avkrysningsboksene når readOnly er usann', () => {
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

  it('Krysser av i riktige bokser', () => {
    const checkedUtbetalingsarsak = Object.values(redusertUtbetalingArsak)[0];
    const vedtakVarsel = {redusertUtbetalingÅrsaker: [checkedUtbetalingsarsak]};
    const readOnly = true;
    const expectedCheckedValue = checkboxField => checkboxField.key() === checkedUtbetalingsarsak;
    vedtakRedusertUtbetalingArsaker(readOnly, vedtakVarsel)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('checked')).to.be.equal(expectedCheckedValue(checkboxField)));
  })
});
