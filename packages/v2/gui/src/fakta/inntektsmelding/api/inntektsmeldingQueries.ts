import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { queryKeys } from '../../../shared/query-keys/queryKeys.js';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';
import { InntektsmeldingApiContext } from './InntektsmeldingApiContext.js';

export const useKompletthetsoversikt = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandling } = useInntektsmeldingContext();

  return useSuspenseQuery({
    queryKey: [...queryKeys.KOMPLETTHET_BEREGNING, behandling.uuid],
    queryFn: () => api.hentKompletthetsoversikt(behandling.uuid),
  });
};

export const useEtterspørInntektsmelding = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));

  return useMutation<void, Error, EtterspørInntektsmeldingRequest>({
    mutationFn: requestBody => api.etterspørInntektsmelding(requestBody),
    throwOnError: true,
  });
};

export const useSettPåVent = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  return useMutation<void, Error, SettBehandlingPaVentDto>({
    mutationFn: requestBody => api.settPåVent(requestBody),
    throwOnError: true,
  });
};
