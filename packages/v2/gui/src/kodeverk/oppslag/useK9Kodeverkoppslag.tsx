import { FailingK9SakKodeverkoppslag, K9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakClientContext } from '../../app/K9SakClientContext.jsx';

export interface K9Kodeverkoppslag {
  readonly isPending: boolean;
  readonly k9sak: K9SakKodeverkoppslag;
  // XXX Legg til for andre backends her. (k9-klage, k9-tilbake)
}

export const useK9Kodeverkoppslag = (): K9Kodeverkoppslag => {
  const k9sakClient = useContext(K9SakClientContext);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['k9sak-kodeverkoppslag'],
    queryFn: () => k9sakClient.kodeverk.alleKodeverdierSomObjekt(),
  });

  if (isPending) {
    return {
      isPending,
      k9sak: new FailingK9SakKodeverkoppslag(),
    };
  }
  if (isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${error}`, error);
  }
  return {
    isPending,
    k9sak: new K9SakKodeverkoppslag(data),
  };
};
