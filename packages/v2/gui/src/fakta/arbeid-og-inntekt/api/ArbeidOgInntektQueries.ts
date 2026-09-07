import { useArbeidOgInntektApi } from './ArbeidOgInntektApiContext.js';

export const useArbeidOgInntektOptions = (behandlingUuid: string) => {
  const api = useArbeidOgInntektApi();
  return {
    queryKey: ['arbeid-og-inntekt', behandlingUuid],
    queryFn: () => api.hentArbeidOgInntekt(behandlingUuid),
  };
};
