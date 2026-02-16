import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';
import { InnloggetAnsattContext } from './InnloggetAnsattContext.js';

export const innloggetAnsattQueryOptions = (api: InnloggetAnsattApi) =>
  queryOptions({
    queryKey: ['saksbehandler', 'innlogget', api.backend],
    queryFn: () => api.innloggetBruker(),
    staleTime: Infinity, // Vi trenger pr no ikkje hente denne info igjen før full refresh av sida skjer.
    retry: (failureCount, error) => {
      if (error instanceof ExtendedApiError && error.isClientError) {
        return failureCount < 1; // Kun 1 retry når det er klientfeil.
      }
      return failureCount < 6; // Fleire retries ellers, sidan ingenting fungerer uten denne respons.
    },
  });

export const InnloggetAnsattProvider: FC<{ readonly api: InnloggetAnsattApi; readonly children: ReactNode }> = ({
  api,
  children,
}) => {
  const { data, error, isFetching } = useSuspenseQuery(innloggetAnsattQueryOptions(api));
  if (error != null && !isFetching) {
    throw new Error(`Informasjon om innlogget saksbehandler ble ikke lastet.`, { cause: error });
  }

  return <InnloggetAnsattContext value={data}>{children}</InnloggetAnsattContext>;
};
