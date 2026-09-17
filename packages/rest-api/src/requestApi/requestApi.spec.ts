import RequestApi from './RequestApi';
import RequestConfig from '../RequestConfig';
import HttpClientApi from '../HttpClientApiTsType';

describe('RequestApi', () => {
  const httpClientGeneralMock: HttpClientApi = {
    get: () => Promise.reject(new Error('Ikkje implementert i mock')),
    post: () => Promise.reject(new Error('Ikkje implementert i mock')),
    put: () => Promise.reject(new Error('Ikkje implementert i mock')),
    getBlob: () => Promise.reject(new Error('Ikkje implementert i mock')),
    postBlob: () => Promise.reject(new Error('Ikkje implementert i mock')),
    getAsync: () => Promise.reject(new Error('Ikkje implementert i mock')),
    postAsync: () => Promise.reject(new Error('Ikkje implementert i mock')),
    putAsync: () => Promise.reject(new Error('Ikkje implementert i mock')),
  };

  it('skal utføre get-request', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const requestConfig = new RequestConfig('BEHANDLING', '/behandling');
    const params = {
      behandlingId: 1,
    };

    const api = new RequestApi(httpClientMock, [requestConfig]);

    const result = await api.startRequest(requestConfig.name, params);

    expect(result.payload).toEqual('data');
  });
});
