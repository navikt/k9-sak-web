import { AxiosResponse } from 'axios';
import axiosEtag from './axiosEtag';

import initRestMethods from './initRestMethods';

/*
 * Noen kodeverkoppføringer inneholder foreløpig ekstra attributter i kodeverkobjktet. Disse skal ikke konverteres (enda)
 */
const ignorerKodeverkKonvertering = ['AKSJONSPUNKT_DEF'];

/*
 * Rekursivt konverterer kodeverkobjekter til kodeverkstrenger  
 */
const konverterKodeverkTilKode = (data: any, erTilbakekreving: boolean, debug = false) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach((key) => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        !ignorerKodeverkKonvertering.includes(data[key]?.kodeverk) &&
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) || antallAttr === 1)
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
