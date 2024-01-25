import { vi } from 'vitest';
import * as httpUtils from '../axiosHttpUtils';
import * as responseHelpers from '../responseHelpers';

vi.mock('httpUtils');

describe.skip('httpUtils', () => {
  const mockedErrorHandler = () => null;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('get', () => {
    afterEach(() => {
      vi.mocked(httpUtils.get).mockClear();
    });
    const goodResponseMock = { data: 'mockedData' };
    const badRequestResponseMock = { response: { status: 400, headers: {} } };

    it('should return the data-property from the response when the promise resolved', async () => {
      vi.mocked(httpUtils.get).mockImplementation(() => Promise.resolve(goodResponseMock));
      const data = await httpUtils.get('', () => null);
      expect(data).toEqual(goodResponseMock.data);
    });

    it('should throw an error and console.error when the promise is rejected', async () => {
      vi.mocked(httpUtils.get).mockImplementation(() => Promise.reject(badRequestResponseMock));
      const error = httpUtils.get('', () => null);
      await expect(error).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(badRequestResponseMock);
    });

    it('should call function triggering the provided httpErrorHandler when required', async () => {
      const httpErrorHandlerCaller = vi.spyOn(responseHelpers, 'handleErrorExternally');
      const checkerFn = vi.spyOn(responseHelpers, 'httpErrorShouldBeHandledExternally');
      checkerFn.mockReturnValueOnce(true);

      vi.mocked(httpUtils.get).mockImplementation(() => Promise.reject(badRequestResponseMock));

      const error = httpUtils.get('', mockedErrorHandler);
      await expect(error).rejects.toThrow('');
      expect(httpErrorHandlerCaller).toHaveBeenCalledWith(badRequestResponseMock, mockedErrorHandler);
    });

    it('should avoid calling function triggering httpErrorHandler when unneccessary', async () => {
      const httpErrorHandlerCaller = vi.spyOn(responseHelpers, 'handleErrorExternally');
      const checkerFn = vi.spyOn(responseHelpers, 'httpErrorShouldBeHandledExternally');
      checkerFn.mockReturnValueOnce(false);

      vi.mocked(httpUtils.get).mockImplementation(() => Promise.reject(badRequestResponseMock));

      await expect(httpUtils.get('', mockedErrorHandler)).rejects.toThrow('');
      expect(httpErrorHandlerCaller).not.toHaveBeenCalled();
    });
  });

  describe('post', () => {
    afterEach(() => {
      vi.mocked(httpUtils.post).mockClear();
    });
    const goodResponseMock = { data: 'mockedData' };
    const badRequestResponseMock = { response: { status: 400, headers: {} } };

    it('should return the data-property from the response when the promise resolved', async () => {
      vi.mocked(httpUtils.post).mockImplementation(() => Promise.resolve(goodResponseMock));
      const data = await httpUtils.post('', null, null);
      expect(data).toEqual(goodResponseMock.data);
    });

    it('should throw an error and console.error when the promise is rejected', async () => {
      vi.mocked(httpUtils.post).mockImplementation(() => Promise.reject(badRequestResponseMock));
      const error = httpUtils.post('', null, null);
      await expect(error).rejects.toEqual(badRequestResponseMock);
      expect(console.error).toHaveBeenCalledWith(badRequestResponseMock);
    });

    it('should call function triggering the provided httpErrorHandler when required', async () => {
      const httpErrorHandlerCaller = vi.spyOn(responseHelpers, 'handleErrorExternally');
      const checkerFn = vi.spyOn(responseHelpers, 'httpErrorShouldBeHandledExternally');
      checkerFn.mockReturnValueOnce(true);

      vi.mocked(httpUtils.post).mockImplementation(() => Promise.reject(badRequestResponseMock));

      const error = httpUtils.post('', null, mockedErrorHandler);
      await expect(error).rejects.toEqual(badRequestResponseMock);
      expect(httpErrorHandlerCaller).toHaveBeenCalledWith(badRequestResponseMock, mockedErrorHandler);
    });

    it('should avoid calling function triggering httpErrorHandler when unneccessary', async () => {
      const httpErrorHandlerCaller = vi.spyOn(responseHelpers, 'handleErrorExternally');
      const checkerFn = vi.spyOn(responseHelpers, 'httpErrorShouldBeHandledExternally');
      checkerFn.mockReturnValueOnce(false);

      vi.mocked(httpUtils.post).mockImplementation(() => Promise.reject(badRequestResponseMock));

      await expect(httpUtils.post('', null, mockedErrorHandler)).rejects.toEqual(badRequestResponseMock);
      expect(httpErrorHandlerCaller).not.toHaveBeenCalled();
    });
  });
});
