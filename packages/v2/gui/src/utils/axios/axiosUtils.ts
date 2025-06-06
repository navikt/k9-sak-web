import type { AxiosRequestConfig } from 'axios';

export const legacySerializerOptionConfig: AxiosRequestConfig = {
  headers: { 'X-Json-Serializer-Option': 'kodeverdi-objekt' },
};

export const addLegacySerializerOption = (requestConfig?: AxiosRequestConfig): AxiosRequestConfig => {
  if (requestConfig != null) {
    return { ...requestConfig, headers: { ...requestConfig.headers, ...legacySerializerOptionConfig.headers } };
  }
  return legacySerializerOptionConfig;
};
