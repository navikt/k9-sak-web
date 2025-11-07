import { useQuery } from '@tanstack/react-query';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagDto as Feriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/types.js';

export const useFeriepengegrunnlag = (behandlingUuid: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['feriepengegrunnlag', behandlingUuid],
    queryFn: async () => {
      if (!behandlingUuid) {
        console.log('useFeriepengegrunnlag: No behandlingUuid provided');
        return null;
      }

      const response = await fetch(
        `/k9/sak/api/behandling/beregningsresultat/feriepengegrunnlag?behandlingUuid=${behandlingUuid}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error('useFeriepengegrunnlag: Failed to fetch:', response.status, response.statusText);
        throw new Error('Failed to fetch feriepengegrunnlag');
      }

      const data = await response.json();
      return data as Feriepengegrunnlag | null;
    },
    enabled: enabled && !!behandlingUuid,
  });
};
