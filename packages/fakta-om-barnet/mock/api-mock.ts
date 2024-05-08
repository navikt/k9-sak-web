/* eslint-disable import/prefer-default-export */
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8082/mock/rettVedDod', () =>
    HttpResponse.json(
      {
        vurdering: 'dette er en vurdering',
        rettVedDødType: 'RETT_12_UKER',
      },
      { status: 200 },
    ),
  ),

  http.get('http://localhost:8082/mock/omPleietrengende', () =>
    HttpResponse.json(
      {
        fnr: '012345678912',
        navn: 'DUCK DOLE',
        diagnosekoder: ['R619', 'A300'],
        dodsdato: '2021-05-26',
      },
      { status: 200 },
    ),
  ),
];
