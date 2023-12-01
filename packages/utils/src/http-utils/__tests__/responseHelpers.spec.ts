import { AxiosError } from 'axios';
import {
  handleErrorExternally,
  httpErrorShouldBeHandledExternally,
  isForbidden,
  isUnauthorized,
} from '../responseHelpers';

describe('responseHelpers', () => {
  it('isUnauthorized should return true if provided code is 401', () => {
    expect(isUnauthorized(401)).toBe(true);
  });

  it('isForbidden should return true if provided code is 403', () => {
    expect(isForbidden(403)).toBe(true);
  });

  describe('httpErrorShouldBeHandledExternally', () => {
    it('should return true if status is 401', () => {
      const error = { response: { status: 401 } };
      const outcome = httpErrorShouldBeHandledExternally(error as AxiosError);
      expect(outcome).toBe(true);
    });

    it('should return true if status is 403', () => {
      const error = { response: { status: 403 } };
      const outcome = httpErrorShouldBeHandledExternally(error as AxiosError);
      expect(outcome).toBe(true);
    });

    it('should return false for error status codes such as 400, 404 and 500', () => {
      const errorCodes = [400, 404, 500];
      errorCodes.forEach(errorCode => {
        const error = { response: { status: errorCode } };
        const outcome = httpErrorShouldBeHandledExternally(error as AxiosError);
        expect(outcome).toBe(false);
      });
    });
  });
  describe('handleErrorExternally', () => {
    it('should call the provided function with the expected arguments', () => {
      const errorResponse = { response: { status: 401, headers: { location: 'mockedLocation' } } };
      const errorHandler = jest.fn();
      handleErrorExternally(errorResponse as any, errorHandler);

      const { calls } = errorHandler.mock;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(errorResponse.response.status);
      expect(calls[0][1]).toBe(errorResponse.response.headers.location);
    });
  });
});
