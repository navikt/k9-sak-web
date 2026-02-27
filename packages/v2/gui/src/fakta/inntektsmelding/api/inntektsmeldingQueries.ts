import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { useContext } from 'react';
import { InntektsmeldingApiContext } from './InntektsmeldingApiContext.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';
import { queryKeys } from '../../../shared/query-keys/queryKeys.js';

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
    throwOnError: false,
  });
};

export const useSettPåVent = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  return useMutation<void, Error, SettBehandlingPaVentDto>({
    mutationFn: requestBody => api.settPåVent(requestBody),
    throwOnError: true,
  });
};
