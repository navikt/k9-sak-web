import { describe, expect, it } from 'vitest';
import { isValueOfConstObject } from './isValueOfConstObject.js';
import { safeConstCombine } from './safeConstCombine.js';

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
  if (isValueOfConstObject(o, one)) {
    requiresOne(o);
    return true;
  }
  return false;
};

describe('isValueOfStringConstObject', () => {
  it('should return true when called with prop from combined object that exists in given object', () => {
    expect(isValueOfConstObject(combined.a, one)).toBe(true);
    expect(isValueOfConstObject(combined.b, one)).toBe(true);

    expect(isValueOfConstObject(combined.a, two)).toBe(true);
    expect(isValueOfConstObject(combined.c, two)).toBe(true);
  });
  it('should return false when called with prop from combined object that does NOT exist in given object', () => {
    expect(isValueOfConstObject(combined.c, one)).toBe(false);
    expect(isValueOfConstObject(combined.b, two)).toBe(false);
  });

  it('should return true when called with value that exists in given object', () => {
    expect(isValueOfConstObject('a', one)).toBe(true);
    expect(isValueOfConstObject('b', one)).toBe(true);
    expect(isValueOfConstObject('a', two)).toBe(true);
    expect(isValueOfConstObject('c', two)).toBe(true);
  });
  it('should return false when called with value that does not exist in given object', () => {
    expect(isValueOfConstObject('e', one)).toBe(false);
    expect(isValueOfConstObject('v', one)).toBe(false);
  });

  it('should work when used as type guard', () => {
    expect(toOneRequired(combined.c)).toBe(false);
    expect(toOneRequired(combined.a)).toBe(true);

    // @ts-expect-error Should fail compilation
    expect(toOneRequired('d')).toBe(false);
  });
});
