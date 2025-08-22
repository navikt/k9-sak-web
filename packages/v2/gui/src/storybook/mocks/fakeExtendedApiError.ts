import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/v2/ExtendedApiError.js';
import type { K9SakErrorData } from '@k9-sak-web/backend/k9sak/errorhandling/errorData.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';

type MakeFakeApiErrorArgs = Readonly<{
  status: number;
  url?: string;
  method?: 'GET' | 'POST';
  error?: string | object;
}>;

type MakeFakeExtendedApiErrorArgs = MakeFakeApiErrorArgs &
  Readonly<{
    navCallid?: string;
  }>;

export const makeFakeExtendedApiError = ({
  status,
  url = '/fake/url',
  method = 'GET',
  error = '',
  navCallid = 'CallId_00000000_11111111',
}: MakeFakeExtendedApiErrorArgs): ExtendedApiError => {
  const req: Request = new Request(url, {
    method,
  });
  const resp = new Response(null, { status });
  return new ExtendedApiError(req, resp, error, navCallid);
};

type MakeFakeK9SakValidationErrorArgs = Pick<MakeFakeExtendedApiErrorArgs, 'url' | 'method' | 'navCallid'> &
  Readonly<{
    error: K9SakErrorData;
  }>;

export const makeFakeK9SakValidationError = ({
  url = '/fake/url',
  method = 'GET',
  error,
  navCallid = 'CallId_00000000_2222222',
}: MakeFakeK9SakValidationErrorArgs): K9SakApiError => {
  const req = new Request(url, { method });
  const resp = new Response(null, { status: 400 });
  return new K9SakApiError(req, resp, error, navCallid);
};
