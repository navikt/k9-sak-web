import axiosEtag from './axiosEtag';

import initRestMethods from './initRestMethods';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/interceptors/navCallid.js';

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
  const axiosInstance = axiosEtag();

  axiosInstance.interceptors.request.use((c): any => {
    const { headerName, headerValue } = generateNavCallidHeader();
    const config = { ...c };
    config.headers[headerName] = headerValue;
    return config;
  });

  const restMethods = initRestMethods(axiosInstance);
  return {
    get: restMethods.get,
    post: restMethods.post,
    put: restMethods.put,
    getBlob: restMethods.getBlob,
    postBlob: restMethods.postBlob,
    getAsync: restMethods.getAsync,
    postAsync: restMethods.postAsync,
    putAsync: restMethods.putAsync,
    axiosInstance,
  };
};

export default getAxiosHttpClientApi;
