import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingDtoSakstype } from '@k9-sak-web/backend/ungsak/generated';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import { UngSakClientContext } from '@k9-sak-web/gui/app/UngSakClientContext.js';
import { useContext } from 'react';

/**
 * Hook for å hente riktig backend client basert på sakstype
 * @param sakstype Sakstype for å bestemme hvilken client som skal brukes
 * @returns Riktig backend client
 */
export const useBackendClient = (sakstype: FagsakYtelsesType) => {
  const ungSakClient = useContext(UngSakClientContext);
  const k9SakClient = useContext(K9SakClientContext);

  return sakstype === BehandlingDtoSakstype.UNGDOMSYTELSE ? ungSakClient : k9SakClient;
};
