/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import mockedKompletthetsdata from './mockedKompletthetsdata';

export const handlers = [
  rest.get('http://localhost:8082/mock/kompletthet', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedKompletthetsdata)),
  ),
];
