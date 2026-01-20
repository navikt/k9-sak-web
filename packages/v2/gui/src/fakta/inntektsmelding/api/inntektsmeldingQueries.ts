import { useSuspenseQuery } from '@tanstack/react-query';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { useContext } from 'react';
import { InntektsmeldingApiContext } from './InntektsmeldingApiContext.js';

export const useKompletthetsoversikt = () => {
  const api = assertDefined(useContext(InntektsmeldingApiContext));
  const { behandlingUuid } = useInntektsmeldingContext();

  return useSuspenseQuery({
    queryKey: ['kompletthet-beregning', behandlingUuid],
    queryFn: () => api.hentKompletthetsoversikt(behandlingUuid),
  });
};
