import { AxiosResponse } from 'axios';

import { identifiserKodeverk, konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

import axiosEtag from './axiosEtag';

import initRestMethods from './initRestMethods';

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

  /*
   * Interceptor for å sjekke alle api resonser for kodeverk-obekter og konverttere dem til nye kodeverkstrenger
   * Denne vil skrive om de "gamle" kodeverkobjektene til nye, og gjør at backend gradvis kan skrive om  til
   * kodeverkstrenger. Når alt er skrevet om kan denne fjernes.
   */
  axiosInstance.interceptors.response.use((response: AxiosResponse) => {
    if (
      response.status === 200 &&
      response.config.url.includes('/api/') &&
      !response.config.url.includes('/api/kodeverk')
    ) {
      const erTilbakekreving = response.config.url.includes('/k9tilbake/api/');

      const bareSeIkkeRøre = false; // bare for lokal debugging
      if (bareSeIkkeRøre) {
        // bare for lokal debugging
        identifiserKodeverk(response.data, erTilbakekreving); // bare for lokal debugging
      } else {
        // bare for lokal debugging
        konverterKodeverkTilKode(response.data, erTilbakekreving); // IKKE bare for lokal debugging
      } // bare for lokal debugging
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
