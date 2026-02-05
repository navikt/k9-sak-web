import { describe, it, expect } from 'vitest';
import { safeConstCombine } from './safeConstCombine.js';
import { isValueOfStringConstObject } from './isValueOfStringConstObject.js';

const one = {
  a: 'a',
  b: 'b',
} as const;

const two = {
  a: 'a',
  c: 'c',
} as const;

const combined = safeConstCombine(one, two);

type OneVals = (typeof one)[keyof typeof one];
type CombinedVals = (typeof combined)[keyof typeof combined];

const requiresOne = (o: OneVals) => o.length;
const toOneRequired = (o: CombinedVals) => {
  if (isValueOfStringConstObject(o, one)) {
    requiresOne(o);
    return true;
  }
  return false;
};

describe('isValueOfStringConstObject', () => {
  it('should return true when called with prop from combined object that exists in given object', () => {
    expect(isValueOfStringConstObject(combined.a, one)).toBe(true);
    expect(isValueOfStringConstObject(combined.b, one)).toBe(true);

    expect(isValueOfStringConstObject(combined.a, two)).toBe(true);
    expect(isValueOfStringConstObject(combined.c, two)).toBe(true);
  });
  it('should return false when called with prop from combined object that does NOT exist in given object', () => {
    expect(isValueOfStringConstObject(combined.c, one)).toBe(false);
    expect(isValueOfStringConstObject(combined.b, two)).toBe(false);
  });

  it('should return true when called with value that exists in given object', () => {
    expect(isValueOfStringConstObject('a', one)).toBe(true);
    expect(isValueOfStringConstObject('b', one)).toBe(true);
    expect(isValueOfStringConstObject('a', two)).toBe(true);
    expect(isValueOfStringConstObject('c', two)).toBe(true);
  });
  it('should return false when called with value that does not exist in given object', () => {
    expect(isValueOfStringConstObject('e', one)).toBe(false);
    expect(isValueOfStringConstObject('v', one)).toBe(false);
  });

  it('should work when used as type guard', () => {
    expect(toOneRequired(combined.c)).toBe(false);
    expect(toOneRequired(combined.a)).toBe(true);

    // @ts-expect-error Should fail compilation
    expect(toOneRequired('d')).toBe(false);
  });
});
