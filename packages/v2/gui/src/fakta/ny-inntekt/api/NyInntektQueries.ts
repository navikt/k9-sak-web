import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assertDefined } from '../../../utils/validation/assertDefined.js';
import { BehandlingContext } from '../../../context/BehandlingContext.js';
import { NyInntektApiContext } from './NyInntektApiContext.js';

export const useReaktiverAksjonspunktNyInntekt = () => {
  const api = assertDefined(useContext(NyInntektApiContext));
  const behandlingContext = assertDefined(useContext(BehandlingContext));
  const behandlingUuid = assertDefined(behandlingContext.behandlingUuid);

  return useMutation<void, Error, void>({
    mutationFn: () => api.reaktiverAksjonspunktNyInntekt(behandlingUuid),
    onSuccess: () => behandlingContext.refetchBehandling(),
    throwOnError: true,
  });
};
