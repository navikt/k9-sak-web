import moment from 'moment';
import {
  dateRangesAreSequential,
  decimalRegex,
  integerRegex,
  isEmpty,
  isoDateRegex,
  nameGyldigRegex,
  nameRegex,
  saksnummerOrFodselsnummerPattern,
  tomorrow,
  yesterday,
} from './validatorsHelper';

describe('validatorsHelper', () => {
  describe('isoDateRegex', () => {
    it('Skal sjekke om dato format er riktig ISO', () => {
      expect(isoDateRegex.test('2018-04-01')).toBe(true);
      expect(isoDateRegex.test('12-04-2018')).toBe(false);
    });
  });

  describe('integerRegex', () => {
    it('Skal sjekke om input er int', () => {
      expect(integerRegex.test('34')).toBe(true);
      expect(integerRegex.test('34.5')).toBe(false);
      expect(integerRegex.test('XXX')).toBe(false);
    });
  });

  describe('decimalRegex', () => {
    it('Skal sjekke om input er desimal', () => {
      expect(decimalRegex.test('23,34')).toBe(true);
      expect(decimalRegex.test('XXX')).toBe(false);
    });
  });

  describe('saksnummerOrFodselsnummerPattern', () => {
    it('Skal sjekke om saksnummer er i riktig format', () => {
      expect(saksnummerOrFodselsnummerPattern.test('123456789012345678')).toBe(true);
      expect(saksnummerOrFodselsnummerPattern.test('X123456789012345678')).toBe(false);
    });
  });

  describe('nameRegex', () => {
    it('Skal sjekke om input er et navn', () => {
      expect(nameRegex.test('Ola Nordmann')).toBe(true);
      expect(nameRegex.test('Ola Nordmann!')).toBe(false);
    });
  });

  describe('nameGyldigRegex', () => {
    it('Skal sjekke om navn er et gyldig navn', () => {
      expect(nameGyldigRegex.test('Ola Nordmann')).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('Skal sjekke om input er tom', () => {
      const emptyText = null;
      const text = 'Not Empty';
      expect(isEmpty(emptyText)).toBe(true);
      expect(isEmpty(text)).toBe(false);
    });
  });

  describe('yesterday', () => {
    it('Skal sjekke om dato er i går', () => {
      expect(yesterday()).toEqual(moment().subtract(1, 'days').startOf('day'));
    });
  });

  describe('tomorrow', () => {
    it('Skal sjekke om dato er i morgen', () => {
      expect(tomorrow()).toEqual(moment().add(1, 'days').startOf('day'));
    });
  });

  describe('dateRangesAreSequential', () => {
    it('Skal sjekke om datoer er etter hverandre', () => {
      const rangesMatch = [
        ['2018-04-01', '2018-05-01'],
        ['2018-04-01', '2018-05-01'],
      ];
      const ranges = [
        ['2018-04-01', '2018-05-01'],
        ['2018-05-02', '2018-05-31'],
      ];
      expect(dateRangesAreSequential(rangesMatch)).toBe(false);
      expect(dateRangesAreSequential(ranges)).toBe(true);
    });
  });
});
