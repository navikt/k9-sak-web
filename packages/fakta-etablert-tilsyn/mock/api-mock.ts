/* eslint-disable import/prefer-default-export */
import { http, HttpResponse } from 'msw';
import { mockUrlPrepend } from './constants';
import mockedSykdom from './mocked-data/mockedSykdom';
import mockedTilsyn from './mocked-data/mockedTilsyn';

export const handlers = [
  http.get(`${mockUrlPrepend}/mock/tilsyn`, () => HttpResponse.json(mockedTilsyn, { status: 200 })),
  http.get(`${mockUrlPrepend}/mock/sykdom`, () => HttpResponse.json(mockedSykdom, { status: 200 })),

  http.get(`${mockUrlPrepend}/mock/sykdomInnleggelse`, () => HttpResponse.json({ perioder: [] }, { status: 200 })),
];
