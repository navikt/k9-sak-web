import { isErrorWithAlertInfo } from './AlertInfo.js';
import { FrontendError } from '../FrontendError.js';

describe('isErrorWithAlertInfo', () => {
  it('should return true when given a instance of FrontendError', () => {
    expect(isErrorWithAlertInfo(new FrontendError('test'))).toBe(true);
  });
  it('should return false when given a instance of Error', () => {
    expect(isErrorWithAlertInfo(new Error('test'))).toBe(false);
  });
});
