import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi.js';
import { kodeverkK9Sak } from './kodeverK9Sak.js';
import { kodeverkK9Tilbake } from './kodeverkK9Tilbake.js';
import { kodeverkK9Klage } from './kodeverkK9Klage.js';
import { AbstractRequestApi } from '@k9-sak-web/rest-api';

/**
 * Brukast i stories eller tester for å sette standard mock data for legacy api data oppsett.
 * @param requestApi (global) requestApi konstant sendast inn her for å gjere det tydeleg at den blir endra.
 */
export const setBaseRequestApiMocks = (requestApi: AbstractRequestApi): void => {
  // Setter mock api data for init fetch kall. Tomt pr no, legg til viss behov oppstår
  requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
  requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
  // Setter mock api data for kodeverk api kall. Data er kopiert ut frå dev.
  requestApi.mock(K9sakApiKeys.KODEVERK, kodeverkK9Sak);
  requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, kodeverkK9Tilbake);
  requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, kodeverkK9Klage);
};
