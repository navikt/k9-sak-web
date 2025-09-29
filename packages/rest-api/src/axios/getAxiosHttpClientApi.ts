import { AxiosResponse } from 'axios';
import axiosEtag from './axiosEtag';

import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { jsonSerializerOption } from '@k9-sak-web/backend/shared/jsonSerializerOption.js';
import { konverterKodeverkTilKodeSelektivt } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKodeSelektivt.js';
import { xJsonSerializerOptions } from '../xJsonSerializerOptions';
import initRestMethods from './initRestMethods';

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
    // Legg til X-Json-Serializer-Option header for å instruere server om å bruke legacy "kodeverk-objekt" ObjectMapper
    // for alle requests som går gjennom denne klient. Kan vurdere å gjere denne meir konfigurerbar pr backend/request
    // seinare viss det er behov.
    config.headers[jsonSerializerOption.xJsonSerializerOptionHeader] = xJsonSerializerOptions.kodeverdiObjekt;
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
      response.config.url &&
      response.config.url.includes('/api/') &&
      !response.config.url.includes('/api/kodeverk')
    ) {
      const erTilbakekreving =
        response.config.url.includes('/k9/tilbake/api/') || response.config.url.includes('/ung/tilbake/api/');
      konverterKodeverkTilKodeSelektivt(response.data, erTilbakekreving);
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
