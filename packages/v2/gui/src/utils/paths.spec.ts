import { describe, expect, it } from 'vitest';
import { gyldigBehandlingId } from './paths.js';

describe('gyldigBehandlingId', () => {
  it('should return number if input string is only number digits (or blanks) making a positive integer', () => {
    const numberStrings = ['123', '00123', '0', ' 123', ' 123 '];
    for (const numberString of numberStrings) {
      // eslint-disable-next-line vitest/valid-expect
      expect(gyldigBehandlingId(numberString), `got undefined instead of number for input "${numberString}"`).toEqual(
        Number.parseInt(numberString),
      );
    }
  });
  it('should return undefined when input string is NOT just number digits or space', () => {
    const notNumberStrings = ['', 'aa123', '123bb', '-33', 'a'];
    for (const notNumberString of notNumberStrings) {
      expect(
        gyldigBehandlingId(notNumberString),
        // eslint-disable-next-line vitest/valid-expect
        `got number instead of undefined for input "${notNumberString}"`,
      ).toBeUndefined();
    }
  });
});
