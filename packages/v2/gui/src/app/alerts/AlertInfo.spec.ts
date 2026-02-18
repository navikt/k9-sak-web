import GeneralAsyncError from './GeneralAsyncError.js';
import { isErrorWithAlertInfo } from './AlertInfo.js';

describe('isErrorWithAlertInfo', () => {
  it('should return true when given a instance of GeneralAsyncError', () => {
    expect(isErrorWithAlertInfo(new GeneralAsyncError('test'))).toBe(true);
  });
});
