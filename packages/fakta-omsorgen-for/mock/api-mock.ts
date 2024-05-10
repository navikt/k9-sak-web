/* eslint-disable import/prefer-default-export */
import { http, HttpResponse } from 'msw';
import mockedOmsorgsperioder from './mocked-data/mockedOmsorgsperioder';

export const handlers = [
  http.get('http://localhost:8082/mock/omsorgsperioder', () =>
      HttpResponse.json({
          omsorgsperioder: mockedOmsorgsperioder,
          registrertSammeBosted: true,
          registrertForeldrerelasjon: true,
          tvingManuellVurdering: false,
      }, { status: 200 }),
  ),
];
