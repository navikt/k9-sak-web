/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import mockedSykdom from './mocked-data/mockedSykdom';
import mockedTilsyn from './mocked-data/mockedTilsyn';

export const handlers = [
  rest.get('http://localhost:8082/mock/tilsyn', (req, res, ctx) => res(ctx.status(200), ctx.json(mockedTilsyn))),
  rest.get('http://localhost:8082/mock/sykdom', (req, res, ctx) => res(ctx.status(200), ctx.json(mockedSykdom))),

  rest.get('http://localhost:8082/mock/sykdomInnleggelse', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ perioder: [] })),
  ),
];
