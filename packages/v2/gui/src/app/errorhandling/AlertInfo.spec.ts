import { isErrorWithAlertInfo } from './AlertInfo.js';
import { AppError } from './AppError.js';

describe('isErrorWithAlertInfo', () => {
  it('should return true when given a instance of AppError', () => {
    expect(isErrorWithAlertInfo(new AppError('test'))).toBe(true);
  });
  it('should return false when given a instance of Error', () => {
    expect(isErrorWithAlertInfo(new Error('test'))).toBe(false);
  });
});
