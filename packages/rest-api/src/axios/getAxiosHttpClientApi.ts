import { AxiosResponse } from 'axios';
import axiosEtag from './axiosEtag';

import initRestMethods from './initRestMethods';

/*
 * Noen kodeverkoppføringer inneholder ekstra attributter i kodeverkobjektet. Disse skal ikke oversettes.
 */
const ignorerKodeverkKonvertering = ['AKSJONSPUNKT_DEF'];

const konverterKodeverkTilKode = (data: any, erTilbakekreving: boolean, debug = false) => {
  if (data === undefined || data === null) {
    return;
  }
  const lengdeKodeverkObject = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        !ignorerKodeverkKonvertering.includes(data[key]?.kodeverk) &&
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObject) || antallAttr === 1)
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving, debug);
    }
  });
};

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
  const axiosInstance = axiosEtag();

  // TODO (TOR) sentry bør ikkje vera ein avhengighet til pakka "rest-api". Konfigurer dette utanfor
  axiosInstance.interceptors.request.use((c): any => {
    const navCallId = `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`;
    const config = { ...c };
    config.headers['Nav-Callid'] = navCallId;
    return config;
  });

  axiosInstance.interceptors.response.use((response: AxiosResponse): any => {
    if (
      response.status === 200 &&
      response.config.url.includes('/api/') &&
      !response.config.url.includes('/api/kodeverk')
    ) {
      const erTilbakekreving = response.config.url.includes('/k9tilbake/api');
      konverterKodeverkTilKode(response.data, erTilbakekreving);
    }
    return response;
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
