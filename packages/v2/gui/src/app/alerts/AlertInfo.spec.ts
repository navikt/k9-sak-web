import { isErrorWithAlertInfo } from './AlertInfo.js';
import GeneralAsyncError from './GeneralAsyncError.js';

describe('isErrorWithAlertInfo', () => {
  it('should return true when given a instance of GeneralAsyncError', () => {
    expect(isErrorWithAlertInfo(new GeneralAsyncError('test'))).toBe(true);
  });
});
