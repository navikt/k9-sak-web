import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import { ApiError } from '@navikt/k9-sak-typescript-client';
import type { K9SakErrorData } from '@k9-sak-web/backend/k9sak/errorhandling/errorData.ts';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.ts';

type ApiRequestOptions = ApiError['request'];
type ApiResult = ConstructorParameters<typeof ApiError>[1];

type MakeFakeApiErrorArgs = Readonly<{
  status: number;
  url?: string;
  method?: ApiRequestOptions['method'];
  body?: any;
}>;

type MakeFakeExtendedApiErrorArgs = MakeFakeApiErrorArgs &
  Readonly<{
    navCallid?: string;
  }>;

const makeFakeApiError = ({
  status,
  url = '/fake/url',
  method = 'GET',
  body = undefined,
}: MakeFakeApiErrorArgs): ApiError => {
  const fakeRequest: ApiRequestOptions = {
    method,
    url,
    body,
  };
  const fakeResponse: ApiResult = {
    url,
    ok: false,
    status,
    statusText: `Http error (${status})`,
    body,
  };
  return new ApiError(fakeRequest, fakeResponse, 'Fake ApiError');
};

export const makeFakeExtendedApiError = ({
  status,
  url = '/fake/url',
  method = 'GET',
  body = undefined,
  navCallid = 'CallId_00000000_11111111',
}: MakeFakeExtendedApiErrorArgs): ExtendedApiError => {
  const fakeApiError = makeFakeApiError({ status, url, method, body });
  return new ExtendedApiError(fakeApiError, navCallid);
};

type MakeFakeK9SakValidationErrorArgs = Pick<MakeFakeExtendedApiErrorArgs, 'url' | 'method' | 'navCallid'> &
  Readonly<{
    body: K9SakErrorData;
  }>;

export const makeFakeK9SakValidationError = ({
  url,
  method,
  body,
  navCallid = 'CallId_00000000_2222222',
}: MakeFakeK9SakValidationErrorArgs): K9SakApiError => {
  const fakeApiError = makeFakeApiError({ status: 400, url, method, body });
  return new K9SakApiError(fakeApiError, navCallid);
};
