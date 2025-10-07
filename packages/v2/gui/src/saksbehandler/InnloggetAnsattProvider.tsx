import type { FC, ReactNode } from 'react';
import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { InnloggetAnsattContext } from './InnloggetAnsattContext.js';

export const InnloggetAnsattProvider: FC<{ readonly api: InnloggetAnsattApi; readonly children: ReactNode }> = ({
  api,
  children,
}) => {
  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ['saksbehandler', 'innlogget', api],
    queryFn: () => api.innloggetBruker(),
    staleTime: Infinity, // Vi trenger pr no ikkje hente denne info igjen før full refresh av sida skjer.
    gcTime: Infinity,
    retry: 6, // Ingenting fungerer uten disse data, så prøv igjen nokre ganger ved evt feil.
  });
  if (error != null && !isFetching) {
    throw new Error(`Informasjon om innlogget saksbehandler ble ikke lastet.`, { cause: error });
  }

  return <InnloggetAnsattContext value={data}>{children}</InnloggetAnsattContext>;
};
