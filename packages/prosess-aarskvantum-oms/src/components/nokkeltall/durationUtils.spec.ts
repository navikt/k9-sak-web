/* eslint vitest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectNoRedirect"] }] */
import { beregnDagerTimer, DagerTimer, konverterDesimalTilDagerOgTimer, sumTid } from './durationUtils';

const sjekkKonvertering = ({ dager, timer }: DagerTimer, expectedDager, expectedTimer) => {
  expect(dager).toBe(expectedDager);
  expect(timer).toBe(expectedTimer);
};

describe('durationUtils', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('konverterer desimaltall til hele dager og timer med max 2 desimaler', () => {
    const desimal1 = 9.4;
    sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal1), 9, 3);

    const desimal2 = 5.5;
    sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal2), 5, 3.75);

    const heltall = 12;
    sjekkKonvertering(konverterDesimalTilDagerOgTimer(heltall), 12, null);
  });

  // eslint-disable-next-line vitest/expect-expect
  it('konverterer duration til dager og timer', () => {
    const duration1 = 'PT6H30M';
    sjekkKonvertering(beregnDagerTimer(duration1), 0, 6.5);

    const duration2 = 'PT7H30M';
    sjekkKonvertering(beregnDagerTimer(duration2), 1, 0);

    const duration3 = 'PT22H';
    sjekkKonvertering(beregnDagerTimer(duration3), 2, 7);

    const duration4 = 'PT802H30M';
    sjekkKonvertering(beregnDagerTimer(duration4), 107, 0);
  });

  // eslint-disable-next-line vitest/expect-expect
  it('konverterer negativt desimaltall eller duration til dager og timer', () => {
    const desimal = -1.4;
    sjekkKonvertering(konverterDesimalTilDagerOgTimer(desimal), -1, -3);

    const duration = 'PT-10H-30M';
    sjekkKonvertering(beregnDagerTimer(duration), -1, -3);
  });

  it('summerer dager', () => {
    const dt1: DagerTimer = { dager: 2 };
    const dt2: DagerTimer = { dager: 5 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).toEqual(7);
    expect(sum.timer).toEqual(0);
  });

  it('summerer dager og timer', () => {
    const dt1: DagerTimer = { dager: 2, timer: 3 };
    const dt2: DagerTimer = { dager: 5, timer: 2.5 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).toEqual(7);
    expect(sum.timer).toEqual(5.5);
  });

  it('timer over 7.5 gjøres om til dager og timer', () => {
    const dt1: DagerTimer = { dager: 2, timer: 6 };
    const dt2: DagerTimer = { dager: 5, timer: 5.25 };

    const sum = sumTid(dt1, dt2);

    expect(sum.dager).toEqual(8);
    expect(sum.timer).toEqual(3.75);
  });
});
