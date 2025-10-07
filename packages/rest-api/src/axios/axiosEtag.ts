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

// -------- Lightweight ETag cache (Map-based, browser & node compatible) --------

const byLowerCase = (toFind: string) => (value: string) => value.toLowerCase() === toFind;
const getKeys = (headers: Record<string, unknown>) => Object.keys(headers || {});
const getHeaderCaseInsensitive = (headerName: string, headers: Record<string, unknown> = {}) => {
  const key = getKeys(headers).find(byLowerCase(headerName));
  return key ? (headers as Record<string, string>)[key] : undefined;
};

interface CacheValue<T = unknown> {
  etag: string;
  value: T;
  t: number; // timestamp (ms since epoch)
}

class EtagCache {
  private static instance: EtagCache;
  private cache: Map<string, CacheValue> = new Map();
  private readonly ttlMs: number | null; // null => no expiry
  private readonly maxEntries: number | null; // null => unbounded

  private constructor(ttlMs: number | null = 10 * 60 * 1000, maxEntries: number | null = 500) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EtagCache();
    }
    return this.instance;
  }

  private isExpired(entry: CacheValue) {
    return !!this.ttlMs && Date.now() - entry.t > this.ttlMs;
  }

  private evictIfNeeded() {
    if (this.maxEntries && this.cache.size > this.maxEntries) {
      // Simple FIFO eviction; can be upgraded to true LRU if necessary
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
  }

  static get(key: string | undefined): CacheValue | undefined {
    if (!key) return undefined;
    const inst = this.getInstance();
    const entry = inst.cache.get(key);
    if (!entry) return undefined;
    if (inst.isExpired(entry)) {
      inst.cache.delete(key);
      return undefined;
    }
    return entry;
  }

  static set(key: string | undefined, etag: string, value: unknown): boolean {
    if (!key) return false;
    const inst = this.getInstance();
    inst.cache.set(key, { etag, value, t: Date.now() });
    inst.evictIfNeeded();
    return true;
  }

  static reset() {
    this.getInstance().cache.clear();
  }

  // Optional stats for debugging
  static stats() {
    const inst = this.getInstance();
    return { size: inst.cache.size, ttlMs: inst.ttlMs, maxEntries: inst.maxEntries };
  }
}

function isCacheableMethod(config: AxiosRequestConfig) {
  const method = (config.method || 'GET').toUpperCase();
  return method === 'GET' || method === 'HEAD';
}

function buildCacheKey(config: AxiosRequestConfig) {
  if (!config.url) return undefined;
  const method = (config.method || 'GET').toUpperCase();
  return `${method} ${config.url}`; // differentiate GET vs HEAD if needed
}

function getCacheByAxiosConfig(config: AxiosRequestConfig) {
  return EtagCache.get(buildCacheKey(config));
}

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (isCacheableMethod(config)) {
    const key = buildCacheKey(config);
    const cached = EtagCache.get(key);
    if (cached) {
      const merged = new AxiosHeaders(config.headers || {});
      merged.set('If-None-Match', cached.etag);
      // eslint-disable-next-line no-param-reassign
      config.headers = merged;
    }
  }
  return config;
}

function responseInterceptor(response: AxiosResponse) {
  if (isCacheableMethod(response.config)) {
    const etag = getHeaderCaseInsensitive('etag', response.headers);
    if (etag) {
      EtagCache.set(buildCacheKey(response.config), etag, response.data);
    }
  }
  return response;
}

function responseErrorInterceptor(error: AxiosError) {
  if (error.response && error.response.status === 304) {
    const cached = getCacheByAxiosConfig(error.response.config);
    if (!cached) return Promise.reject(error);
    const newResponse = error.response;
    newResponse.status = 200;
    newResponse.data = cached.value;
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
