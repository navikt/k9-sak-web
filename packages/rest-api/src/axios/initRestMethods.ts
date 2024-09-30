import axios, { AxiosInstance, AxiosRequestConfig, ResponseType } from 'axios';

const cancellable = (axiosInstance: AxiosInstance, config: AxiosRequestConfig): Promise<any> => {
  let cancel;
  const request = axiosInstance({
    ...config,
    cancelToken: new axios.CancelToken(c => {
      cancel = c;
    }),
  });
  // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
  request.cancel = cancel;
  return request.catch(error => (axios.isCancel(error) ? Promise.reject(new Error(null)) : Promise.reject(error)));
};

const defaultHeaders = {
  'Cache-Control': 'no-store, no-cache, max-age=0',
  Pragma: 'no-cache',
  Expires: 0,
};

const defaultPostHeaders = {
  'Content-Type': 'application/json',
};

const get =
  (axiosInstance: AxiosInstance) =>
  (url: string, params: any, responseType: ResponseType = 'json') =>
    cancellable(axiosInstance, {
      url,
      params,
      responseType,
      method: 'get',
      headers: {
        ...defaultHeaders,
      },
    });

const post =
  (axiosInstance: AxiosInstance) =>
  (url: string, data: any, responseType: ResponseType = 'json') =>
    cancellable(axiosInstance, {
      url,
      responseType,
      data: JSON.stringify(data),
      method: 'post',
      headers: {
        ...defaultHeaders,
        ...defaultPostHeaders,
      },
    });

const put =
  (axiosInstance: AxiosInstance) =>
  (url: string, data: any, responseType: ResponseType = 'json') =>
    cancellable(axiosInstance, {
      url,
      responseType,
      data: JSON.stringify(data),
      method: 'put',
      headers: {
        ...defaultHeaders,
        ...defaultPostHeaders,
      },
    });

const getBlob = (axiosInstance: AxiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params, 'blob');

const postBlob = (axiosInstance: AxiosInstance) => (url: string, data: any) => post(axiosInstance)(url, data, 'blob');

const getAsync = (axiosInstance: AxiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params);
const postAsync = (axiosInstance: AxiosInstance) => (url: string, params: any) => post(axiosInstance)(url, params);
const putAsync = (axiosInstance: AxiosInstance) => (url: string, params: any) => put(axiosInstance)(url, params);

const initRestMethods = (axiosInstance: AxiosInstance) => {
  const restMethods = {
    get: get(axiosInstance),
    post: post(axiosInstance),
    put: put(axiosInstance),
    getBlob: getBlob(axiosInstance),
    postBlob: postBlob(axiosInstance),
    getAsync: getAsync(axiosInstance),
    postAsync: postAsync(axiosInstance),
    putAsync: putAsync(axiosInstance),
  };

  return {
    ...restMethods,
  };
};

export default initRestMethods;
