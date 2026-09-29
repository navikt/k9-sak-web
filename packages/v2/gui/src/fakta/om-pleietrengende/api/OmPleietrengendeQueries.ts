import { useOmPleietrengendeApi } from './OmPleietrengendeApiContext.js';

export const useOmPleietrengendeOptions = (behandlingUuid: string) => {
  const api = useOmPleietrengendeApi();
  return {
    queryKey: ['omPleietrengende', behandlingUuid],
    queryFn: () => api.hentPleietrengende(behandlingUuid),
  };
};
