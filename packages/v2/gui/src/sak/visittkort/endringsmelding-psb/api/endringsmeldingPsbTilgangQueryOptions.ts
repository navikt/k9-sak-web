import { queryOptions } from '@tanstack/react-query';
import type { EndringsmeldingPsbTilgangApi } from './EndringsmeldingPsbTilgangApi.js';

export const endringsmeldingPsbTilgangQueryOptions = (api: EndringsmeldingPsbTilgangApi, saksnummer: string) =>
  queryOptions({
    queryKey: ['endringsmeldingPsbTilgang', saksnummer, api.backend],
    queryFn: () => api.hentEndringsmeldingPsbTilgang(saksnummer),
    // Svaret endres sjelden, og kallet går via innsyn-api og aareg. Unngår nytt kall hver gang popupen åpnes.
    staleTime: 5 * 60 * 1000,
    // Feil vises som «Uvisst, kunne ikke hente svar» i popupen, ikke i nærmeste ErrorBoundary.
    throwOnError: false,
    retry: false,
  });
