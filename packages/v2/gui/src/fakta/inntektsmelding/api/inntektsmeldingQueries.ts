import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { useContext } from 'react';
import { InntektsmeldingApiContext } from './InntektsmeldingApiContext.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';

export const useKompletthetsoversikt = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandlingUuid } = useInntektsmeldingContext();

  return useSuspenseQuery({
    queryKey: ['kompletthet-beregning', behandlingUuid],
    queryFn: () => api.hentKompletthetsoversikt(behandlingUuid),
    
  });
};

export const useEtterspørInntektsmelding = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandlingUuid } = useInntektsmeldingContext();

  return useMutation<void, Error, EtterspørInntektsmeldingRequest>({
    mutationFn: requestBody => api.etterspørInntektsmelding(requestBody),
    mutationKey: ['etterspør-inntektsmelding', behandlingUuid],
    throwOnError: true,
  });
};
