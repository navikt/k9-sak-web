import type { FC, ReactNode } from 'react';
import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { InnloggetAnsattContext } from './InnloggetAnsattContext.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

export const InnloggetAnsattProvider: FC<{ readonly api: InnloggetAnsattApi; readonly children: ReactNode }> = ({
  api,
  children,
}) => {
  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ['saksbehandler', 'innlogget', api],
    queryFn: () => api.innloggetBruker(),
    staleTime: Infinity, // Vi trenger pr no ikkje hente denne info igjen før full refresh av sida skjer.
    gcTime: Infinity,
    retry: (failureCount, error) => {
      if (error instanceof ExtendedApiError && error.isClientError) {
        return failureCount < 1; // Kun 1 retry når det er klientfeil.
      }
      return failureCount < 6; // Fleire retries ellers, sidan ingenting fungerer uten denne respons.
    },
  });
  if (error != null && !isFetching) {
    throw new Error(`Informasjon om innlogget saksbehandler ble ikke lastet.`, { cause: error });
  }

  return <InnloggetAnsattContext value={data}>{children}</InnloggetAnsattContext>;
};
