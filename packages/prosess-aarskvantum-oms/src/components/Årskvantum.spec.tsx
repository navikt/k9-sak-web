import { expect } from 'chai';
import React from 'react';
import Årskvantum, { konverterDesimalTilDagerOgTimer } from './Årskvantum';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import CounterBox from './CounterBox';

const sjekkKonvertering = ({ dager, timer }, expectedDager, expectedTimer) => {
  expect(dager).to.equal(expectedDager);
  expect(timer).to.equal(expectedTimer);
};

it('rendrer 3 Counterbox med riktig info', () => {
  const wrapper = shallowWithIntl(
    <Årskvantum totaltAntallDager={20} antallDagerArbeidsgiverDekker={3} forbrukteDager={4.4} restdager={12.6} />,
  );
  const bokser = wrapper.find(CounterBox);
  expect(bokser).to.have.length(3);
});

it('konverterer desimaltall til hele dager og timer med max 1 desimal', () => {
  const desimal_1 = 9.4;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_1), 9, 3);

  const desimal_2 = 5.5;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_2), 5, 3.8);

  const heltall = 12;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(heltall), 12, null);
});
