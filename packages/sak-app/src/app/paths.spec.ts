import { getPathToFplos } from './paths';

describe('paths', () => {
  it('skal hente url til Fplos gitt Fpsak url', () => {
    expect(getPathToFplos()).toEqual(null);
  });
});
