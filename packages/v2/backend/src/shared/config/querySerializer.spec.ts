import { describe, expect, it } from 'vitest';
import { baseQuerySerializer, defaultQuerySerializer } from './querySerializer.js';

describe('defaultQuerySerializer', () => {
  const unchangedQueryArguments = [
    {},
    { a: 'a' },
    { i: 0, b: 'b' },
    { t: true, f: false, n: null },
    { arr1: [], arr2: [1, 2, 3] },
    { obj2: { a: 'a', b: 'b' } },
  ];
  it.for(unchangedQueryArguments)('should not change input %v', query => {
    expect(defaultQuerySerializer(query)).toEqual(baseQuerySerializer(query));
  });

  const singlePropertyQueryArguments = [
    [{ a: { a: 'A' } }, 'a=A'],
    [{ a: { b: 'A' } }, 'a=A'],
    [{ a: { n: 123 } }, 'a=123'],
    [{ a: { n: 0 } }, 'a=0'],
    [{ a: { n: { nn: 123 } }, b: 'B', c: [10, 20] }, 'a=123&b=B&c=10&c=20'],
    [{ a: { an: null, ann: undefined, annn: '', annnn: '  ', v: 'A' } }, 'a=A'],
  ];
  it.for(singlePropertyQueryArguments)('should extract single property values from %v', ([query, expected]) => {
    expect(defaultQuerySerializer(query)).toEqual(expected);
  });
});
