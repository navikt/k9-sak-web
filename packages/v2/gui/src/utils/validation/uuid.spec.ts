import { describe, expect, it } from 'vitest';
import { isValidUuid } from './uuid.js';

describe('isValidUuid', () => {
  it('should return true for various valid uuids', () => {
    const validUuids = [
      '019adebf-629e-72df-9400-34e3e4c2a80a', // version 7
      '3dc2ef7a-8a42-4a09-a37b-2644cae61b13', // version 4
      '85cfc5b8-cf6f-11f0-8de9-0242ac120002', // version 1
      '00000000-0000-0000-0000-000000000000', // empty
    ];

    for (const validUuid of validUuids) {
      expect(isValidUuid(validUuid)).toEqual(true);
    }
  });

  it('should return false for various other input', () => {
    const notValidUuids = [
      '0000000-0000-0000-0000-000000000000', // missing character
      't0000000-0000-0000-0000-000000000000', // invalid character
      '00000000-0000-0000-000r-000000000000', // invalid character
      '123', // number
      '', // empty string
      '  ', // blank string
    ];
    for (const notValidUuid of notValidUuids) {
      expect(isValidUuid(notValidUuid)).toEqual(false);
    }
  });
});
