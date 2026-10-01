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

// refetchOnMount og refetchOnWindowFocus er av, ellers gjentas kallet flere ganger, for eksempel ved bytte av prosesssteg
export const uttakArbeidsgivereQueryOptions = (api: UttakBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['uttak-arbeidsgivere', behandlingUuid, api.backend],
    queryFn: async () => {
      const arbeidsgivere = await api.getArbeidsgivere(behandlingUuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export const uttakInntektsgraderingerQueryOptions = (api: UttakBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['uttak-inntektsgraderinger', behandlingUuid, api.backend],
    queryFn: () => api.hentInntektsgraderinger(behandlingUuid),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
