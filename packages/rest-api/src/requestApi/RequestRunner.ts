import HttpClientApi from '../HttpClientApiTsType';
import RequestAdditionalConfig from '../RequestAdditionalConfigTsType';
import AsyncPollingStatus from './asyncPollingStatus';
import RequestErrorEventHandler from './error/RequestErrorEventHandler';
import TimeoutError from './error/TimeoutError';
import EventType from './eventType';
import { Response } from './ResponseTsType';

const HTTP_ACCEPTED = 202;
const MAX_POLLING_ATTEMPTS = 150;
export const REQUEST_POLLING_CANCELLED = 'INTERNAL_CANCELLATION';

// eslint-disable-next-line no-promise-executor-return
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const hasLocationAndStatusDelayedOrHalted = (responseData): boolean =>
  responseData.location &&
  (responseData.status === AsyncPollingStatus.DELAYED || responseData.status === AsyncPollingStatus.HALTED);

type Notify = (eventType: keyof typeof EventType, data?: any, isPolling?: boolean) => void;
type NotificationEmitter = (eventType: keyof typeof EventType, data?: any) => void;

let popupWindow = null;

/**
 * RequestRunner
 *
 * Denne klassen utfører et spesifikt kall mot en URL. Håndterer også "long-polling".
 *
 * En starter prosess med run og avbryter med cancel.
 */
class RequestRunner {
  httpClientApi: HttpClientApi;

  restMethod: (url: string, params: any, responseType?: string) => Promise<Response>;

  path: string;

  config: RequestAdditionalConfig;

  maxPollingLimit: number = MAX_POLLING_ATTEMPTS;

  notify: Notify = () => undefined;

  isCancelled = false;

  isPollingRequest = false;

  constructor(
    httpClientApi: HttpClientApi,
    restMethod: (url: string, params: any, responseType?: string) => Promise<Response>,
    path: string,
    config: RequestAdditionalConfig,
  ) {
    this.httpClientApi = httpClientApi;
    this.restMethod = restMethod;
    this.path = path;
    this.config = config;
    this.maxPollingLimit = config.maxPollingLimit || this.maxPollingLimit;
  }

  setNotificationEmitter = (notificationEmitter: NotificationEmitter): void => {
    this.notify = notificationEmitter;
  };

  execLongPolling = async (location: string, pollingInterval = 0, pollingCounter = 0): Promise<Response> => {
    if (pollingCounter === this.maxPollingLimit) {
      throw new TimeoutError(location);
    }

    await wait(pollingInterval);

    if (this.isCancelled) {
      return null;
    }

    this.notify(EventType.STATUS_REQUEST_STARTED);
    const statusOrResultResponse = await this.httpClientApi.get(location);
    this.notify(EventType.STATUS_REQUEST_FINISHED);

    if (!('data' in statusOrResultResponse)) {
      return statusOrResultResponse;
    }
    const responseData = statusOrResultResponse.data;
    if (responseData && responseData.status === AsyncPollingStatus.PENDING) {
      const { pollIntervalMillis, message } = responseData;
      this.notify(EventType.UPDATE_POLLING_MESSAGE, message);
      return this.execLongPolling(location, pollIntervalMillis, pollingCounter + 1);
    }

    return statusOrResultResponse;
  };

  execute = async (
    path: string,
    restMethod: (pathArg: string, params?: any) => Promise<Response>,
    params: any,
  ): Promise<Response> => {
    let response = await restMethod(path, params);
    if ('status' in response && response.status === HTTP_ACCEPTED) {
      this.isPollingRequest = true;
      try {
        response = await this.execLongPolling(response.headers.location);
      } catch (error) {
        const responseData = error.response ? error.response.data : undefined;
        if (responseData && hasLocationAndStatusDelayedOrHalted(responseData)) {
          response = await this.httpClientApi.get(responseData.location);
          if ('data' in response) {
            this.notify(EventType.POLLING_HALTED_OR_DELAYED, response.data.taskStatus);
          }
        } else {
          throw error;
        }
      }
    }
    return response;
  };

  cancel = (): void => {
    this.isCancelled = true;
  };

  executeRequest = async params => {
    const response = await this.execute(this.path, this.restMethod, params);
    if (this.isCancelled) {
      return { payload: REQUEST_POLLING_CANCELLED };
    }

    const responseData = 'data' in response ? response.data : undefined;
    this.notify(EventType.REQUEST_FINISHED, responseData, this.isPollingRequest);
    return responseData ? { payload: responseData } : { payload: undefined };
  };

  retryStart = (response, params): Promise<{ payload: any }> =>
    new Promise((resolve, reject) => {
      if (popupWindow === null) {
        const location = `${response.headers.location}`;
        const queryParamAddition = location.includes('?') ? '&' : '?';
        const redirectTo = location.includes('/ung/sak/') ? '/ung/web' : '/k9/web';
        const redirectLocation = `${location}${queryParamAddition}redirectTo=${redirectTo}/close`;
        popupWindow = window.open(redirectLocation, undefined, 'height=600,width=800');
      }
      const timer = setInterval(async () => {
        if (popupWindow && !popupWindow.closed) {
          return;
        }
        clearInterval(timer);
        try {
          const retryResponse = await this.executeRequest(params);
          resolve(retryResponse);
          popupWindow = null;
        } catch (error2) {
          void new RequestErrorEventHandler(this.notify, this.isPollingRequest).handleError(error2);
          reject(error2);
        }
      }, 500);
    });

  start = async (params: any): Promise<{ payload: any }> => {
    this.notify(EventType.REQUEST_STARTED);
    try {
      const response = await this.executeRequest(params);
      return response;
    } catch (error) {
      const { response } = error;
      if (response && response.status === 401 && response.headers && response.headers.location) {
        return this.retryStart(response, params);
      }
      void new RequestErrorEventHandler(this.notify, this.isPollingRequest).handleError(error);
      throw error;
    }
  };
}

export default RequestRunner;
