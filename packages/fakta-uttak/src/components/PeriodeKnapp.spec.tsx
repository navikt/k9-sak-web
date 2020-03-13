import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import PeriodeKnapp from './PeriodeKnapp';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';
import { UttakFaktaFormContext } from './uttakUtils';

describe('<PeriodeKnapp>', () => {
  it('formater en periode og viser som en knapp', () => {
    const periode: ArbeidsforholdPeriode = {
      fom: '2020-02-03',
      tom: '2020-04-05',
      timerIJobbTilVanlig: 40,
      timerFårJobbet: 20,
    };
    const wrapper = mount(
      <UttakFaktaFormContext.Provider value={{}}>
        <PeriodeKnapp periode={periode} periodeIndex={1} />
      </UttakFaktaFormContext.Provider>,
    );

    const knapp = wrapper.find('button');
    const periodetekst = knapp.text();

    expect(periodetekst).to.contain('03.02.2020 - 05.04.2020');
  });
});
