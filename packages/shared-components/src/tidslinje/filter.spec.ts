import dayjs, { Dayjs } from 'dayjs';
import { Positioned } from '@k9-sak-web/types/src/tidslinje';
import { erSynlig, innenEtDøgn } from './filter';

const enDato = ({ plussDager = 0, plussTimer = 0 } = {}): Dayjs =>
  dayjs('2020-01-01').add(plussDager, 'day').add(plussTimer, 'hour');

const etPosisjonertElement = (horizontalPosition = 50): Positioned => ({
  horizontalPosition,
  direction: 'left',
});

test('innenEtDøgn', () => {
  expect(innenEtDøgn(enDato(), enDato())).toBeTruthy();
  expect(innenEtDøgn(enDato(), enDato({ plussDager: 1 }))).toBeTruthy();
  expect(innenEtDøgn(enDato(), enDato({ plussDager: 2 }))).toBeFalsy();
  expect(innenEtDøgn(enDato({ plussDager: 1 }), enDato())).toBeTruthy();
  expect(innenEtDøgn(enDato({ plussDager: 2 }), enDato())).toBeFalsy();
  expect(innenEtDøgn(enDato(), enDato({ plussTimer: 1 }))).toBeTruthy();
  expect(innenEtDøgn(enDato({ plussTimer: 1 }), enDato())).toBeTruthy();
});

test('outOfBounds', () => {
  expect(erSynlig(etPosisjonertElement())).toBeTruthy();
  expect(erSynlig(etPosisjonertElement(50))).toBeTruthy();
  expect(erSynlig(etPosisjonertElement(100))).toBeTruthy();
  expect(erSynlig(etPosisjonertElement(-1))).toBeFalsy();
  expect(erSynlig(etPosisjonertElement(101))).toBeFalsy();
});
