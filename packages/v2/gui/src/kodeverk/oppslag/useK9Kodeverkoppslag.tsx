import { FailingK9SakKodeverkoppslag, K9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakClientContext } from '../../app/K9SakClientContext.jsx';
import { FailingK9KlageKodeverkoppslag, K9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9klage/generated/sdk.js';

export interface K9Kodeverkoppslag {
  readonly isPending: boolean;
  readonly k9sak: K9SakKodeverkoppslag;
  readonly k9klage: K9KlageKodeverkoppslag;
  // XXX Legg til for andre backends her. (k9-tilbake)
}

// Bruk context istadenfor denne hook. `useContext(K9KodeverkoppslagContext)`
export const useK9Kodeverkoppslag = (): K9Kodeverkoppslag => {
  const k9sakClient = useContext(K9SakClientContext);
  const k9sakQuery = useQuery({
    queryKey: ['k9sak-kodeverkoppslag'],
    queryFn: () => k9sakClient.kodeverk.alleKodeverdierSomObjekt(),
  });
  const k9klageQuery = useQuery({
    queryKey: ['k9klage-kodeverkoppslag'],
    queryFn: async () => {
      const res = await kodeverk_alleKodeverdierSomObjekt();
      return res.data;
    },
  });

  const isPending = k9sakQuery.isPending || k9klageQuery.isPending;

  if (isPending) {
    return {
      isPending,
      k9sak: new FailingK9SakKodeverkoppslag(),
      k9klage: new FailingK9KlageKodeverkoppslag(),
    };
  }
  if (k9sakQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${k9sakQuery.error}`, k9sakQuery.error);
  }
  if (k9klageQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${k9klageQuery.error}`, k9klageQuery.error);
  }
  return {
    isPending,
    k9sak: new K9SakKodeverkoppslag(k9sakQuery.data),
    k9klage: new K9KlageKodeverkoppslag(k9klageQuery.data),
  };
};
