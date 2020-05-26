import { expect } from 'chai';
import React from 'react';
import Årskvantum, { beregnDagerTimer, konverterDesimalTilDagerOgTimer } from './Årskvantum';
import CounterBox from './CounterBox';
import { mountWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';

const sjekkKonvertering = ({ dager, timer }, expectedDager, expectedTimer) => {
  expect(dager).to.equal(expectedDager);
  expect(timer).to.equal(expectedTimer);
};

it('rendrer smittevern hvis restdager er nagativt, ellers ikke', () => {
  const wrapper = restdager =>
    mountWithIntl(
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
  expect(bokserUtenSmittevern).to.have.length(5);

  const bokserMedSmittevern = wrapper(-12).find(CounterBox);
  expect(bokserMedSmittevern).to.have.length(6);
});

it('konverterer desimaltall til hele dager og timer med max 1 desimal', () => {
  const desimal_1 = 9.4;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_1), 9, 3);

  const desimal_2 = 5.5;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_2), 5, 3.8);

  const heltall = 12;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(heltall), 12, null);
});

it('konverterer duration til dager og timer', () => {
  const duration_1 = 'PT6H30M';
  sjekkKonvertering(beregnDagerTimer(duration_1), 0, 6.5);

  const duration_2 = 'PT7H30M';
  sjekkKonvertering(beregnDagerTimer(duration_2), 1, 0);

  const duration_3 = 'PT22H';
  sjekkKonvertering(beregnDagerTimer(duration_3), 2, 7);

  const duration_4 = 'PT802H30M';
  sjekkKonvertering(beregnDagerTimer(duration_4), 107, 0);
});
