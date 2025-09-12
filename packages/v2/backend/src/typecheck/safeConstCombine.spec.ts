import { describe, it, expect } from 'vitest';
import { safeConstCombine } from './safeConstCombine.js';

describe('safeConstCombine', () => {
  const o1 = {
    a: 'A',
    b: 'B',
  } as const;

  const o2 = {
    a: 'A',
    b: 'B',
    c: 'C',
  } as const;

  const o3 = {
    a: 'A',
    b: 'B',
    d: 'D',
  } as const;

  const o4 = {
    b: 'B',
    c: 'C',
    c1: 'C', // Different property with same value is ok
  } as const;

  // This will not be compatible with any of the objects defined above
  const fo1 = {
    a: 'A',
    b: 'FEIL',
  } as const;

  //type Union = typeof o1 & typeof o2 & typeof o3

  it('should merge two compatible objects without failing', () => {
    const mo: typeof o1 & typeof o2 = safeConstCombine(o1, o2);
    const mmo = { ...o1, ...o2 } as const;
    expect(mo.b).toEqual(mmo.b);
  });

  it('should merge three compatible objects without failing', () => {
    const mo = safeConstCombine(o1, o2, o3);
    const mo2: typeof o1 = safeConstCombine(o2, o3, o1);
    expect(mo.b).toEqual(o2.b);
    expect(mo2.b).toBe(o2.b);
  });

  it('should merge four compatible objects without failing', () => {
    const mo: typeof o1 & typeof o2 & typeof o3 & typeof o4 = safeConstCombine(o1, o2, o3, o4);
    expect(mo).toEqual({ ...o4, ...o3, ...o2, ...o1 });
    // The order of merging should not matter
    const mo2: typeof o1 & typeof o2 & typeof o3 & typeof o4 = safeConstCombine(o4, o1, o3, o2);
    expect(mo2).toEqual({ ...o4, ...o3, ...o2, ...o1 });
  });

  it('should fail compilation if expected return type does not match input', () => {
    // @ts-expect-error Expects type mismatch here
    const mo: typeof o4 = safeConstCombine(o1, o2);
    expect(mo.b).toEqual(o1.b);
  });

  it('should fail compilation when one property has different value in two different input objects', () => {
    // @ts-expect-error Expects type to be symbol here
    const mo: typeof o1 & typeof fo1 = safeConstCombine(o1, fo1);
    const mo2 = safeConstCombine(o1, fo1);
    const mmo = { ...o1, ...fo1 };
    // @ts-expect-error Expects type to be never here
    expect(mo.a).toEqual(mmo.a);
    expect(mmo.a).toEqual(o1.a);
    // @ts-expect-error Expects type to be never here
    expect(mo2.a).toEqual(mmo.a);
    // @ts-expect-error Expects type to be never here
    expect(mo.a == mo2.a && mo2.a == mmo.a).toBe(true);
  });

  it('should fail compilation with many input objects, as long as one has different value', () => {
    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(o1, o2, fo1).a).toEqual(o1.a);
    // @ts-expect-error Expects type to be never here
    const v: typeof o1 = safeConstCombine(o1, o2, fo1);
    expect(v.a).toEqual(o1.a);
    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(fo1, o2).a).toEqual(fo1.a);
    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(fo1, o2, o1, o4).a).toEqual(fo1.a);
    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(o1, fo1, o2, o4).a).toEqual(fo1.a);
    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(o1, o2, fo1, o4).a).toEqual(fo1.a);

    // @ts-expect-error Expects type to be never here
    expect(safeConstCombine(fo1, o1, o2, o4, fo1).a).toEqual(o1.a);
  });

  it('should give compile error if given non constant objects', () => {
    const no1 = {
      a: 'A',
      b: 'B',
    } as const;
    const no2 = {
      a: 'A',
      c: 'C',
    };
    // @ts-expect-error Expects compilation error because no2 is not a constant
    safeConstCombine(no1, no2);
    // @ts-expect-error Expects compilation error because no2 is not a constant
    safeConstCombine(no2, no1);
    // @ts-expect-error Expects compilation error because no2 is not a constant
    safeConstCombine(no1, no1, no2, no1);
    // @ts-expect-error Expects compilation error because arguments are not objects
    safeConstCombine('a', 'b');
    expect(true).toBe(true);
  });
});
