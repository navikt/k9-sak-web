import { AxiosError, AxiosHeaders } from 'axios';
import { vi } from 'vitest';
import * as httpUtils from '../axiosHttpUtils';

vi.mock('httpUtils');

describe.skip('httpUtils', () => {
  const mockedErrorNotifier = vi.fn();

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

    it('should return the data-property from the response when the promise resolved', async () => {
      vi.mocked(httpUtils.get<typeof goodResponseMock>).mockImplementation(() => Promise.resolve(goodResponseMock));
      const data = await httpUtils.get('', mockedErrorNotifier);
      expect(data).toEqual(goodResponseMock.data);
    });

    it('should throw and call errorNotifier when the promise is rejected with AxiosError', async () => {
      const axiosError = new AxiosError('Request failed', '400', undefined, undefined, {
        status: 400,
        statusText: 'Bad Request',
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      });
      vi.mocked(httpUtils.get).mockImplementation(() => Promise.reject(axiosError));
      await expect(httpUtils.get('', mockedErrorNotifier)).rejects.toThrow();
      expect(mockedErrorNotifier).toHaveBeenCalledWith(axiosError);
    });

    it('should not call errorNotifier on 401 with location header (redirect)', async () => {
      const axiosError = new AxiosError('Unauthorized', '401', undefined, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        data: {},
        headers: { location: 'https://login.example.com' },
        config: { headers: new AxiosHeaders() },
      });
      vi.mocked(httpUtils.get).mockImplementation(() => Promise.reject(axiosError));
      await expect(httpUtils.get('', mockedErrorNotifier)).rejects.toThrow();
      expect(mockedErrorNotifier).not.toHaveBeenCalled();
    });
  });

  describe('post', () => {
    afterEach(() => {
      vi.mocked(httpUtils.post).mockClear();
    });
    const goodResponseMock = { data: 'mockedData' };

    it('should return the data-property from the response when the promise resolved', async () => {
      vi.mocked(httpUtils.post).mockImplementation(() => Promise.resolve(goodResponseMock));
      const data = await httpUtils.post('', null, mockedErrorNotifier);
      expect(data).toEqual(goodResponseMock.data);
    });

    it('should throw and call errorNotifier when the promise is rejected with AxiosError', async () => {
      const axiosError = new AxiosError('Request failed', '403', undefined, undefined, {
        status: 403,
        statusText: 'Forbidden',
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      });
      vi.mocked(httpUtils.post).mockImplementation(() => Promise.reject(axiosError));
      await expect(httpUtils.post('', null, mockedErrorNotifier)).rejects.toThrow();
      expect(mockedErrorNotifier).toHaveBeenCalledWith(axiosError);
    });
  });
});
