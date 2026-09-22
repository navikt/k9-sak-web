import { http, HttpResponse } from 'msw';
import { mockUrlPrepend } from './constants';
import mockedOmsorgsperioder, { mockedOmsorgsperioderVurdert } from './mocked-data/mockedOmsorgsperioder';

export const handlers = [
  http.get(`${mockUrlPrepend}/mock/omsorgsperioder`, () => HttpResponse.json(mockedOmsorgsperioder, { status: 200 })),
];

export const handlersVurdert = [
  http.get(`${mockUrlPrepend}/mock/omsorgsperioder`, () =>
    HttpResponse.json(mockedOmsorgsperioderVurdert, { status: 200 }),
  ),
];

export const handlersError = [
  http.get(`${mockUrlPrepend}/mock/omsorgsperioder`, () => HttpResponse.json(null, { status: 500 })),
];
