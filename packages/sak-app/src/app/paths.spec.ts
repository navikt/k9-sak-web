import { getPathToFplos } from './paths';

describe('paths', () => {
  it('skal hente url til Fplos gitt Fpsak url', () => {
    Object.defineProperty(globalThis, 'window', {
      value: { location: { href: 'https://example.com/es' } },
      writable: true,
    });
    expect(getPathToFplos()).toEqual(null);
  });
});
