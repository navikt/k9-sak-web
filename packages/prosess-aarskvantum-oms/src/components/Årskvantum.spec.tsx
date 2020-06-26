import { expect } from 'chai';
import React from 'react';
import Årskvantum, { beregnDagerTimer, DagerTimer, konverterDesimalTilDagerOgTimer, sumTid } from './Årskvantum';
import CounterBox from './CounterBox';
import { mountWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import Uttaksperiode from '../dto/Uttaksperiode';

const sjekkKonvertering = ({ dager, timer }: DagerTimer, expectedDager, expectedTimer) => {
  expect(dager).to.equal(expectedDager);
  expect(timer).to.equal(expectedTimer);
};

it('rendrer smittevern hvis restdager er negative og i smittevernsperioden, ellers ikke', () => {
  const wrapper = restdager => {
    // @ts-ignore
    const periodeISmittevernsperioden: Uttaksperiode = {
      periode: '2020-05-05/2020-05-31',
    };
    // @ts-ignore
    const periodeUtenforSmittevernsperioden: Uttaksperiode = {
      periode: '2020-03-01/2020-03-31',
    };
    return mountWithIntl(
      <Årskvantum
        totaltAntallDager={20}
        antallDagerArbeidsgiverDekker={3}
        forbrukteDager={4.4}
        restdager={restdager}
        benyttetRammemelding
        antallDagerInfotrygd={0}
        uttaksperioder={[periodeISmittevernsperioden, periodeUtenforSmittevernsperioden]}
      />,
    );
  };

  const bokserUtenSmittevern = wrapper(12).find(CounterBox);
  expect(bokserUtenSmittevern).to.have.length(5);

  const bokserMedSmittevern = wrapper(-12).find(CounterBox);
  expect(bokserMedSmittevern).to.have.length(6);
});

it('konverterer desimaltall til hele dager og timer med max 2 desimaler', () => {
  const desimal_1 = 9.4;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_1), 9, 3);

  const desimal_2 = 5.5;
  sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal_2), 5, 3.75);

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

describe('summer dagerTimer', () => {
  it('summerer dager', () => {
    const dt1: DagerTimer = { dager: 2 };
    const dt2: DagerTimer = { dager: 5 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).to.eql(7);
    expect(sum.timer).to.eql(0);
  });

  it('summerer dager og timer', () => {
    const dt1: DagerTimer = { dager: 2, timer: 3 };
    const dt2: DagerTimer = { dager: 5, timer: 2.5 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).to.eql(7);
    expect(sum.timer).to.eql(5.5);
  });

  it('timer over 7.5 gjøres om til dager og timer', () => {
    const dt1: DagerTimer = { dager: 2, timer: 6 };
    const dt2: DagerTimer = { dager: 5, timer: 5.25 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).to.eql(8);
    expect(sum.timer).to.eql(3.75);
  });
});
