import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Årskvantum, { konverterDesimalTilDagerOgTimer } from './Årskvantum';
import CounterBox from './CounterBox';

const sjekkKonvertering = ({ dager, timer }, expectedDager, expectedTimer) => {
  expect(dager).to.equal(expectedDager);
  expect(timer).to.equal(expectedTimer);
};

it('rendrer smittevern hvis restdager er nagativt, ellers ikke', () => {
  const wrapper = restdager =>
    shallow(
      <Årskvantum
        totaltAntallDager={20}
        antallDagerArbeidsgiverDekker={3}
        forbrukteDager={4.4}
        restdager={restdager}
        benyttetRammemelding
        antallDagerInfotrygd={0}
      />,
    );

  const bokserUtenSmittevern = wrapper(12).find(CounterBox);
  expect(bokserUtenSmittevern).to.have.length(3);

  const bokserMedSmittevern = wrapper(-12).find(CounterBox);
  expect(bokserMedSmittevern).to.have.length(4);
});

it('rendrer koronadager hvis det finnes', () => {
  const wrapper = shallow(
    <Årskvantum
      totaltAntallDager={20}
      antallDagerArbeidsgiverDekker={3}
      forbrukteDager={4.4}
      antallKoronadager={10}
      restdager={4}
      benyttetRammemelding
      antallDagerInfotrygd={0}
    />,
  );

  const bokser = wrapper.find(CounterBox);
  expect(bokser).to.have.length(4);
});

it('konverterer desimaltall til hele dager og timer med max 1 desimal', () => {
  const desimal_1 = 9.4;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_1), 9, 3);

  const desimal_2 = 5.5;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_2), 5, 3.8);

  const heltall = 12;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(heltall), 12, null);
});
