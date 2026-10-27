import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { addLegacySerializerOption } from '@k9-sak-web/gui/utils/axios/axiosUtils.js';
import { blobToText, isOfTypeBlob } from '@k9-sak-web/gui/app/errorhandling/legacycompat/blobResponseHelper.js';
import { BlobResponseAxiosError } from '@k9-sak-web/gui/app/errorhandling/legacycompat/BlobResponseAxiosError.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';

// Legg til Nav-Callid-header (i tillegg til legacy serializer-option) slik at forespørslar herifrå
// kan sporast på tvers av tenester på lik linje med forespørslar via rest-api-klienten.
const buildRequestConfig = (requestConfig?: AxiosRequestConfig): AxiosRequestConfig => {
  const { headerName, headerValue } = generateNavCallidHeader();
  const config = addLegacySerializerOption(requestConfig);
  return { ...config, headers: { ...config.headers, [headerName]: headerValue } };
};

async function resolveErrorType(error: unknown): Promise<Error> {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const location = error.response?.headers?.location;
    if (status === 401 && location) {
      // Redirect til innlogging, ikkje notify — vi forlèt sida.
      // TODO Dette bør sannsynlegvis endrast. Bør ha ein stad å fange dette tilfellet på og agere på det. Skal også snart bygge om autentisering.
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      const sep = location.includes('?') ? '&' : '?';
      window.location.href = `${location}${sep}redirectTo=${currentPath}`;
    }
    if (isOfTypeBlob(error)) {
      const responseData = error.response?.data;
      if (responseData instanceof Blob) {
        const text = await blobToText(responseData);
        return new BlobResponseAxiosError(error, text);
      }
    }
  }
  return error instanceof Error ? error : new Error(String(error));
}

export async function get<T>(
  url: string,
  errorNotifier: (error: Error) => void,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(url, buildRequestConfig(requestConfig));
    return response.data;
  } catch (error) {
    const resolved = await resolveErrorType(error);
    errorNotifier(resolved);
    throw resolved;
  }
}

export async function post<T>(
  url: string,
  body: T,
  errorNotifier: (error: Error) => void,
  requestConfig?: AxiosRequestConfig,
): Promise<any> {
  try {
    const response: AxiosResponse = await axios.post(url, body, buildRequestConfig(requestConfig));
    return response.data;
  } catch (error) {
    const resolved = await resolveErrorType(error);
    errorNotifier(resolved);
    throw resolved;
  }
}
