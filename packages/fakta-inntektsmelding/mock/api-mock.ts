/* eslint-disable import/prefer-default-export */
import { http, HttpResponse } from 'msw';
import mockedKompletthetsdata from './mockedKompletthetsdata';

export const handlers = [
  http.get('http://localhost:8082/mock/kompletthet', () => HttpResponse.json(mockedKompletthetsdata, { status: 200 })),
];
