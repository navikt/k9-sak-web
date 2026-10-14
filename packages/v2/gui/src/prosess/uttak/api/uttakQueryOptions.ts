import { queryOptions } from '@tanstack/react-query';
import { ignore404Errors } from '../../../app/errorhandling/ignore404Errors.js';
import type { UttakBackendApiType } from './UttakBackendApiType.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

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
        const apiError = ExtendedApiError.findInError(error);
        if (apiError?.isNotFound) {
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
  });

export const uttakInntektsgraderingerQueryOptions = (api: UttakBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['uttak-inntektsgraderinger', behandlingUuid, api.backend],
    queryFn: () => api.hentInntektsgraderinger(behandlingUuid),
    refetchOnMount: false,
  });

export const uttakOverstyringerQueryOptions = (api: UttakBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['uttak-overstyringer', behandlingUuid, api.backend],
    queryFn: () => api.hentOverstyringUttak(behandlingUuid),
  });

export const uttakAktuelleAktiviteterQueryOptions = (
  api: UttakBackendApiType,
  behandlingUuid: string,
  fom: string,
  tom: string,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ['uttak-aktuelle-aktiviteter', behandlingUuid, fom, tom, enabled, api.backend],
    queryFn: () => api.hentAktuelleAktiviteter(behandlingUuid, fom, tom),
    throwOnError: ignore404Errors,
    enabled,
  });
