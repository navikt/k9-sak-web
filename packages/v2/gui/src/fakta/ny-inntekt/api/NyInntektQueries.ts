import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBehandlingContext, useBehandlingUuid } from '../../../context/BehandlingContext.js';
import { useNyInntektApi } from './NyInntektApiContext.js';

const kanReaktivereQueryKey = (behandlingUuid: string) => ['kanReaktivereAksjonspunktNyInntekt', behandlingUuid];

export const useKanReaktivereAksjonspunktNyInntekt = (enabled: boolean) => {
  const api = useNyInntektApi();
  const behandlingUuid = useBehandlingUuid();

  return useQuery({
    queryKey: [...kanReaktivereQueryKey(behandlingUuid), api.backend],
    queryFn: () => api.kanReaktivereAksjonspunkt(behandlingUuid),
    enabled,
  });
};

export const useReaktiverAksjonspunktNyInntekt = () => {
  const api = useNyInntektApi();
  const behandlingUuid = useBehandlingUuid();
  const { refetchBehandling } = useBehandlingContext();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => api.reaktiverAksjonspunkt(behandlingUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: kanReaktivereQueryKey(behandlingUuid) });
      await refetchBehandling();
    },
    throwOnError: true,
  });
};
