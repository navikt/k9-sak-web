import { queryOptions } from '@tanstack/react-query';
import { ignore404Errors } from '../../../app/errorhandling/ignore404Errors.js';
import type { UttakBackendApiType } from './UttakBackendApiType.js';

export const uttakQueryOptions = (
  api: UttakBackendApiType,
  behandlingUuid: string,
  behandlingVersjon: number | undefined,
) =>
  queryOptions({
    queryKey: ['uttak', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: async () => {
      try {
        return await api.hentUttak(behandlingUuid);
      } catch (error) {
        // useSuspenseQuery støtter ikke throwOnError, så 404 (ingen uttak) gir null i stedet for ErrorBoundary
        if (error instanceof Error && !ignore404Errors(error)) {
          return null;
        }
        throw error;
      }
    },
    // Behandlingsversjon er i nøkkelen, så data trenger ikke hentes på nytt ved hver mount
    staleTime: Infinity,
  });
