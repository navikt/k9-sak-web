import { describe, it, expect } from 'vitest';
import { createQueryClient } from './queryClient.js';

describe('createQueryClient', () => {
  it('should return expected default options when called without argument', () => {
    const opts = createQueryClient().getDefaultOptions();
    expect(opts.queries).toEqual({ refetchOnWindowFocus: false });
    expect(opts.mutations?.throwOnError).toBeFalsy();
    expect(opts.mutations?.onError).toBeTypeOf('function');
  });
  it('should return default queries options, plus queries override when called with argument', () => {
    const opts = createQueryClient({ queries: { retry: false } }).getDefaultOptions();
    expect(opts.queries).toEqual({ refetchOnWindowFocus: false, retry: false });
  });
  it('should override default options set when called with argument', () => {
    const opts = createQueryClient({ queries: { refetchOnWindowFocus: true } }).getDefaultOptions();
    expect(opts.queries).toEqual({ refetchOnWindowFocus: true });
  });
  it('should return default mutations options, plus mutation override when called with argument', () => {
    const opts = createQueryClient({ mutations: { throwOnError: true } }).getDefaultOptions();
    expect(opts.mutations?.throwOnError).toBeTruthy();
    expect(opts.mutations?.onError).toBeTypeOf('function');
  });
});
