/*

(Adapted from https://github.com/raulanatol/axios-etag-cache) 

MIT License

Copyright (c) 2019 Raúl Anatol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import NodeCache from 'node-cache';

const byLowerCase = toFind => value => value.toLowerCase() === toFind;
const getKeys = headers => Object.keys(headers);
const getHeaderCaseInsensitive = (headerName, headers = {}) => headers[getKeys(headers).find(byLowerCase(headerName))];

interface CacheValue {
  etag: string;
  value: any;
}

class EtagCache {
  static instance: EtagCache;

  cache: NodeCache;

  static getInstance() {
    if (!this.instance) {
      this.instance = new EtagCache();
    }
    return this.instance;
  }

  static get(uuid: string): CacheValue | undefined {
    return this.getInstance().cache.get(uuid);
  }

  static set(uuid: string, etag: string, value: any) {
    return this.getInstance().cache.set(uuid, { etag, value });
  }

  static reset() {
    this.getInstance().cache.flushAll();
  }

  constructor() {
    this.cache = new NodeCache();
  }
}

function isCacheableMethod(config: AxiosRequestConfig) {
  return ['GET', 'HEAD'].indexOf(config.method.toUpperCase()) >= 0;
}

function getUUIDByAxiosConfig(config: AxiosRequestConfig) {
  return config.url;
}

function getCacheByAxiosConfig(config: AxiosRequestConfig) {
  return EtagCache.get(getUUIDByAxiosConfig(config));
}

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (isCacheableMethod(config)) {
    const uuid = getUUIDByAxiosConfig(config);
    const lastCachedResult = EtagCache.get(uuid);
    if (lastCachedResult) {
      // eslint-disable-next-line no-param-reassign
      config.headers = new AxiosHeaders({ ...config.headers, 'If-None-Match': lastCachedResult.etag });
    }
  }
  return config;
}

function responseInterceptor(response: AxiosResponse) {
  if (isCacheableMethod(response.config)) {
    const responseETAG = getHeaderCaseInsensitive('etag', response.headers);
    if (responseETAG) {
      EtagCache.set(getUUIDByAxiosConfig(response.config), responseETAG, response.data);
    }
  }
  return response;
}

function responseErrorInterceptor(error: AxiosError) {
  if (error.response && error.response.status === 304) {
    const getCachedResult = getCacheByAxiosConfig(error.response.config);
    if (!getCachedResult) {
      return Promise.reject(error);
    }
    const newResponse = error.response;
    newResponse.status = 200;
    newResponse.data = getCachedResult.value;
    return Promise.resolve(newResponse);
  }
  return Promise.reject(error);
}

export function resetCache() {
  EtagCache.reset();
}

export default function axiosEtag(config?: AxiosRequestConfig) {
  const instance = axios.create(config);
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return instance;
}
