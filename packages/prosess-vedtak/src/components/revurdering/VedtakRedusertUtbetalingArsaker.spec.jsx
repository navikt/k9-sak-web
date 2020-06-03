import React from 'react';
import {expect} from 'chai';
import {shallow} from "enzyme";
import aksjonspunktCodes from "@fpsak-frontend/kodeverk/src/aksjonspunktCodes";
import VedtakRedusertUtbetalingArsaker from "./VedtakRedusertUtbetalingArsaker";
import redusertUtbetalingArsak from "../../kodeverk/redusertUtbetalingArsak";

describe('VedtakRedusertUtbetalingArsaker', () => {

  const vedtakRedusertUtbetalingArsaker = (aksjonspunkter, readOnly) => {
    const attributter = {aksjonspunkter, readOnly};
    return shallow(<VedtakRedusertUtbetalingArsaker {...attributter}/>);
  };

  it('Skal vise avkrysningsboks for hver årsak', () => {
    const aksjonspunkter = [{definisjon: {kode: aksjonspunktCodes.FORESLA_VEDTAK_MANUELT}}];
    const readOnly = false;
    const expectedLength = Object.keys(redusertUtbetalingArsak).length;
    expect(vedtakRedusertUtbetalingArsaker(aksjonspunkter, readOnly).children()).to.have.length(expectedLength);
  });

  it('Avkrysningsboksene skal være aktivert når readOnly er usann', () => {
    const aksjonspunkter = [{definisjon: {kode: aksjonspunktCodes.FORESLA_VEDTAK_MANUELT}}];
    const readOnly = false;
    vedtakRedusertUtbetalingArsaker(aksjonspunkter, readOnly)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('disabled')).to.be.false);
  });

  it('Avkrysningsboksene skal være deaktivert når readOnly er sann', () => {
    const aksjonspunkter = [{definisjon: {kode: aksjonspunktCodes.FORESLA_VEDTAK_MANUELT}}];
    const readOnly = true;
    vedtakRedusertUtbetalingArsaker(aksjonspunkter, readOnly)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('disabled')).to.be.true);
  });

  it('Krysser av i riktige bokser', () => {
    const checkedUtbetalingsarsak = Object.values(redusertUtbetalingArsak)[0];
    const aksjonspunkter = [{
      definisjon: {kode: aksjonspunktCodes.FORESLA_VEDTAK_MANUELT},
      redusertUtbetalingÅrsaker: [checkedUtbetalingsarsak]
    }];
    const readOnly = true;
    const expectedCheckedValue = checkboxField => checkboxField.key() === checkedUtbetalingsarsak;
    vedtakRedusertUtbetalingArsaker(aksjonspunkter, readOnly)
      .children()
      .forEach(checkboxField => expect(checkboxField.prop('checked')).to.be.equal(expectedCheckedValue(checkboxField)));
  })
});
