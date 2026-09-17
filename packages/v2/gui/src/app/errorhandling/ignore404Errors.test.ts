import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { makeFakeExtendedApiError } from '../../storybook/mocks/fakeExtendedApiError.js';
import { ignore404Errors } from './ignore404Errors.js';

const makeFakeAxiosError = (status: number): AxiosError => {
  const config = { headers: new AxiosHeaders() };
  const response = {
    status,
    statusText: '',
    data: undefined,
    headers: new AxiosHeaders(),
    config,
  };
  return new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_RESPONSE', config, undefined, response);
};

describe('ignore404Errors', () => {
  it('returnerer false for AxiosError med status 404 (legacy)', () => {
    expect(ignore404Errors(makeFakeAxiosError(404))).toBe(false);
  });

  it('returnerer false for ExtendedApiError med status 404', () => {
    expect(ignore404Errors(makeFakeExtendedApiError({ status: 404 }))).toBe(false);
  });

  it('returnerer true for andre feil', () => {
    expect(ignore404Errors(new Error('noko gjekk gale'))).toBe(true);
    expect(ignore404Errors(makeFakeAxiosError(500))).toBe(true);
    expect(ignore404Errors(makeFakeExtendedApiError({ status: 500 }))).toBe(true);
  });
});
