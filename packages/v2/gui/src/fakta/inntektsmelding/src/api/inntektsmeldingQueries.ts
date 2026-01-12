import { kompletthet_utledStatusForKompletthet } from '@navikt/k9-sak-typescript-client/sdk';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useInntektsmeldingContext } from '../context/InntektsmeldingContext';

async function fetchKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
  const response = await kompletthet_utledStatusForKompletthet({
    query: { behandlingUuid },
  });
  if (!response.data) {
    throw new Error('No data returned from kompletthet API');
  }
  return response.data;
}

export const useKompletthetsoversikt = () => {
  const { behandlingUuid } = useInntektsmeldingContext();

  return useSuspenseQuery({
    queryKey: ['kompletthet-beregning', behandlingUuid],
    queryFn: () => fetchKompletthetsoversikt(behandlingUuid),
  });
};
