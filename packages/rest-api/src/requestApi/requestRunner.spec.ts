import NotificationMapper from './NotificationMapper';
import RequestRunner, { REQUEST_POLLING_CANCELLED } from './RequestRunner';
import AsyncPollingStatus from './asyncPollingStatus';

class NotificationHelper {
  mapper: NotificationMapper;

  requestStartedCallback = vi.fn();

  requestFinishedCallback = vi.fn();

  requestErrorCallback = vi.fn();

  statusRequestStartedCallback = vi.fn();

  statusRequestFinishedCallback = vi.fn();

  updatePollingMessageCallback = vi.fn();

  addPollingTimeoutEventHandler = vi.fn();

  constructor() {
    const mapper = new NotificationMapper();
    mapper.addRequestStartedEventHandler(this.requestStartedCallback);
    mapper.addRequestFinishedEventHandler(this.requestFinishedCallback);
    mapper.addRequestErrorEventHandlers(this.requestErrorCallback);
    mapper.addStatusRequestStartedEventHandler(this.statusRequestStartedCallback);
    mapper.addStatusRequestFinishedEventHandler(this.statusRequestFinishedCallback);
    mapper.addUpdatePollingMessageEventHandler(this.updatePollingMessageCallback);
    this.mapper = mapper;
  }
}

const httpClientGeneralMock = {
  get: () => undefined,
  post: () => undefined,
  put: () => undefined,
  getBlob: () => undefined,
  postBlob: () => undefined,
  postAndOpenBlob: () => undefined,
  getAsync: () => undefined,
  postAsync: () => undefined,
  putAsync: () => undefined,
};

describe('RequestRunner', () => {
  const HTTP_ACCEPTED = 202;
  const defaultConfig = {
    maxPollingLimit: undefined,
  };

  it('skal hente data via get-kall', async () => {
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

    const process = new RequestRunner(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.start(params);

    expect(result).toStrictEqual({ payload: 'data' });
    expect(notificationHelper.requestStartedCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.requestFinishedCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.requestFinishedCallback.mock.calls[0][0]).toBe('data');
    expect(notificationHelper.requestErrorCallback.mock.calls.length).toBe(0);
  });

  it('skal utføre long-polling request som når maks polling-forsøk', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const allGetResults = [
      {
        ...response,
        data: {
          status: AsyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      },
      {
        ...response,
        data: {
          status: AsyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      },
    ];

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () =>
        Promise.resolve({
          ...response,
          status: HTTP_ACCEPTED,
          headers: {
            location: 'http://polling.url',
          },
        }),
      get: () => Promise.resolve(allGetResults.shift()),
    };

    const params = {
      behandlingId: 1,
    };

    const config = {
      ...defaultConfig,
      maxPollingLimit: 1, // Vil nå taket etter første førsøk
    };

    const process = new RequestRunner(httpClientMock, httpClientMock.getAsync, 'behandling', config);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    await expect(process.start(params)).rejects.toMatchObject({
      message: 'Maximum polling attempts exceeded',
    });

    expect(notificationHelper.requestStartedCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.statusRequestStartedCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.statusRequestFinishedCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.updatePollingMessageCallback.mock.calls.length).toBe(1);
    expect(notificationHelper.updatePollingMessageCallback.mock.calls[0][0]).toBe('Polling continues');
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () =>
        Promise.resolve({
          ...response,
          status: HTTP_ACCEPTED,
          headers: {
            location: 'test',
          },
        }),
      get: () =>
        Promise.resolve({
          ...response,
          data: {
            status: AsyncPollingStatus.PENDING,
            message: 'Polling continues',
            pollIntervalMillis: 0,
          },
        }),
    };

    const params = {
      behandlingId: 1,
    };

    const process = new RequestRunner(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => {
      process.cancel();
      return Promise.resolve('');
    });
    process.setNotificationEmitter(mapper.getNotificationEmitter());

    const resResponse = await process.start(params);

    expect(resResponse).toStrictEqual({ payload: REQUEST_POLLING_CANCELLED });
  });

  it('skal hente data med nullverdi', async () => {
    const response = {
      data: null,
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const process = new RequestRunner(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.start(params);

    expect(result).toStrictEqual({ payload: undefined });
    expect(notificationHelper.requestFinishedCallback.mock.calls[0][0]).toBe(null);
  });
});
