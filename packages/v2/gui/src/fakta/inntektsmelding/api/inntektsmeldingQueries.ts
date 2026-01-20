import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { useContext } from 'react';
import { InntektsmeldingApiContext } from './InntektsmeldingApiContext.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';

export const useKompletthetsoversikt = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandling } = useInntektsmeldingContext();

  return useSuspenseQuery({
    queryKey: ['kompletthet-beregning', behandling.uuid],
    queryFn: () => api.hentKompletthetsoversikt(behandling.uuid),
  });
};

export const useEtterspørInntektsmelding = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandling } = useInntektsmeldingContext();

  return useMutation<void, Error, EtterspørInntektsmeldingRequest>({
    mutationFn: requestBody => api.etterspørInntektsmelding(requestBody),
    mutationKey: ['etterspør-inntektsmelding', behandling.uuid],
    throwOnError: true,
  });
};

export const useSettPåVent = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandling } = useInntektsmeldingContext();

  return useMutation<void, Error, SettBehandlingPaVentDto>({
    mutationFn: requestBody => api.settPåVent(requestBody),
    mutationKey: ['sett-på-vent', behandling.uuid],
    throwOnError: true,
  });
};
