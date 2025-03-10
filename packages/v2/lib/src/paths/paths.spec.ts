import { getPathToK9Los } from './paths';

describe('paths', () => {
  it('skal hente url til Fplos gitt Fpsak url', () => {
    expect(getPathToK9Los()).toEqual(null);
  });
});
