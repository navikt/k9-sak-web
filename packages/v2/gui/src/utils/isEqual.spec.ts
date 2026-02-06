import { describe, expect, test } from 'vitest';
import { isEqual } from './isEqual';

describe('isEqual', () => {
  test('returns true for identical primitive values', () => {
    expect(isEqual(5, 5)).toBe(true);
    expect(isEqual('test', 'test')).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  test('returns false for different primitive values', () => {
    expect(isEqual(5, 10)).toBe(false);
    expect(isEqual('test', 'other')).toBe(false);
    expect(isEqual(true, false)).toBe(false);
  });

  test('returns false when comparing null/undefined with other values', () => {
    expect(isEqual(null, 5)).toBe(false);
    expect(isEqual(undefined, 'test')).toBe(false);
    expect(isEqual(5, null)).toBe(false);
    expect(isEqual('test', undefined)).toBe(false);
  });

  test('returns false for different types', () => {
    expect(isEqual(5, '5')).toBe(false);
    expect(isEqual(true, 1)).toBe(false);
    expect(isEqual([], {})).toBe(false);
  });

  test('returns true for equal arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(isEqual([], [])).toBe(true);
  });

  test('returns false for different arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual(['a'], ['b'])).toBe(false);
  });

  test('returns true for nested equal arrays', () => {
    expect(
      isEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 4],
        ],
      ),
    ).toBe(true);
    expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
  });

  test('returns true for equal objects', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(isEqual({ name: 'test' }, { name: 'test' })).toBe(true);
    expect(isEqual({}, {})).toBe(true);
  });

  test('returns false for different objects', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqual({ name: 'test' }, { name: 'other' })).toBe(false);
  });

  test('returns true for nested equal objects', () => {
    expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(isEqual({ x: [1, 2], y: { z: 3 } }, { x: [1, 2], y: { z: 3 } })).toBe(true);
  });

  test('returns false for nested different objects', () => {
    expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    expect(isEqual({ x: [1, 2] }, { x: [1, 3] })).toBe(false);
  });

  test('handles complex nested structures', () => {
    const obj1 = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      count: 2,
    };
    const obj2 = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      count: 2,
    };
    const obj3 = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Charlie' },
      ],
      count: 2,
    };

    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  test('returns true for same reference', () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];

    expect(isEqual(obj, obj)).toBe(true);
    expect(isEqual(arr, arr)).toBe(true);
  });
});
