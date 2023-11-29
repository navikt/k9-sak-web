/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import mockedOmsorgsperioder from './mocked-data/mockedOmsorgsperioder';

export const handlers = [
  rest.get('http://localhost:8082/mock/omsorgsperioder', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        omsorgsperioder: mockedOmsorgsperioder,
        registrertSammeBosted: true,
        registrertForeldrerelasjon: true,
        tvingManuellVurdering: false,
      }),
    ),
  ),
];
