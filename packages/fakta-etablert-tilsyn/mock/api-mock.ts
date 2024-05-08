/* eslint-disable import/prefer-default-export */
import { http, HttpResponse } from 'msw';
import mockedSykdom from './mocked-data/mockedSykdom';
import mockedTilsyn from './mocked-data/mockedTilsyn';

export const handlers = [
  http.get('http://localhost:8082/mock/tilsyn', () => HttpResponse.json(mockedTilsyn, { status: 200 })),
  http.get('http://localhost:8082/mock/sykdom', () => HttpResponse.json(mockedSykdom, { status: 200 })),

  http.get('http://localhost:8082/mock/sykdomInnleggelse', () => HttpResponse.json({ perioder: [] }, { status: 200 })),
];
