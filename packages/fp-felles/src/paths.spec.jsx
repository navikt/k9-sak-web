import { expect } from 'chai';

import { getPathToFplos } from './paths';

describe('paths', () => {
  it('skal hente url til Fplos gitt Fpsak url', () => {
    expect(getPathToFplos()).is.eql(null);
  });
});
