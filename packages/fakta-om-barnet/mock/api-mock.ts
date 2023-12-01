/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:8082/mock/rettVedDod', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        vurdering: 'dette er en vurdering',
        rettVedDødType: 'RETT_12_UKER',
      }),
    ),
  ),

  rest.get('http://localhost:8082/mock/omPleietrengende', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        fnr: '012345678912',
        navn: 'DUCK DOLE',
        diagnosekoder: ['R619', 'A300'],
        dodsdato: '2021-05-26',
      }),
    ),
  ),
];
