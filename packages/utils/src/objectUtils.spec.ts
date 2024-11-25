// noinspection JSUnresolvedVariable
import { diff, isEqual } from './objectUtils';

describe('Object-utils', () => {
  it('skal returnere true når objekter er like', () => {
    const object1 = { test: 'test' };
    const object2 = { test: 'test' };
    expect(isEqual(object1, object2)).toBe(true);
  });

  it('skal returnere false når objekter er ulike', () => {
    const object1 = { test: 'test' };
    const object2 = { test: 'annet' };
    expect(isEqual(object1, object2)).toBe(false);
  });

  describe('diff', () => {
    it('skal diffe strenger', () => {
      expect(diff('a', 'a')).toBe(false);
      expect(diff('a', 'b')).toBe(true);
    });

    it('skal diffe tall', () => {
      expect(diff(1, 1)).toBe(false);
      expect(diff(1, 2)).toBe(true);
      expect(diff(1, null)).toBe(true);
      expect(diff(null, 2)).toBe(true);
    });

    it('skal diffe boolske verdier', () => {
      expect(diff(true, true)).toBe(false);
      expect(diff(false, true)).toBe(true);
    });

    it('skal diffe funksjoner på referanse', () => {
      const a = () => undefined;
      const b = () => undefined;
      expect(diff(a, a)).toBe(false);
      expect(diff(a, b)).toBe(true);
    });

    it('skal diffe null', () => {
      expect(diff('a', null)).toBe(true);
      expect(diff(null, 0)).toBe(true);
      expect(diff(null, null)).toBe(false);
    });

    describe('arrays', () => {
      it('skal diffe arrays', () => {
        expect(diff(['a'], ['a'])).toEqual([false]);
        expect(diff(['a'], ['b'])).toEqual([true]);
        expect(diff(['a', 'b'], ['a', 'a'])).toEqual([false, true]);
        expect(diff(['a', 'b'], ['a', 'b'])).toEqual([false, false]);
      });

      it('skal diffe arrays av ulik lengde', () => {
        expect(diff(['a', 'b'], ['a'])).toEqual([false, true]);
        expect(diff(['a', 'b', 0], ['a'])).toEqual([false, true, true]);
      });

      it('skal diffe nøstede arrays', () => {
        expect(diff([['a', 'b']], [['a', 'b']])).toEqual([[false, false]]);
        expect(diff([['a', ['b', 'c']]], [['a', ['b', 'd']]])).toEqual([[false, [false, true]]]);
      });

      it('skal diffe mot undefined som om mot tom array', () => {
        expect(diff(['a', 'b'], undefined)).toEqual([true, true]);
        expect(diff(undefined, [['a', 'b']])).toEqual([[true, true]]);
        expect(diff([['a', ['b', 'c']]], [['a', ['b', undefined]]])).toEqual([[false, [false, true]]]);
      });
    });

    describe('objects', () => {
      it('skal diffe objekter', () => {
        expect(diff({ a: 'a' }, { a: 'a' })).toEqual({ a: false });
        expect(diff({ a: 'a' }, { a: 'b' })).toEqual({ a: true });
        expect(diff({ a: 'a' }, { b: 'a' })).toEqual({ a: true, b: true });
        expect(diff({ a: [0, 2] }, { a: [0, 2] })).toEqual({ a: [false, false] });
        expect(diff({ a: [0, 2] }, { a: [0, 3] })).toEqual({ a: [false, true] });
      });

      it('skal diffe mot undefined som om mot tomt object', () => {
        expect(diff({ a: 'a' }, undefined)).toEqual({ a: true });
        expect(diff(undefined, { a: { b: 'c' } })).toEqual({ a: { b: true } });
      });
    });
  });
});
