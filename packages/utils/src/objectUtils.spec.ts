// noinspection JSUnresolvedVariable
import { isEqual } from './objectUtils';

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
});
