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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
