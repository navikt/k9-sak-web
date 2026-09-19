import { useOmsorgenForApi } from './OmsorgenForApiContext.js';

export const useOmsorgenForOptions = (behandlingUuid: string) => {
  const api = useOmsorgenForApi();
  return {
    queryKey: ['omsorgsperiodeoversikt', behandlingUuid],
    queryFn: () => api.getOmsorgsperioder(behandlingUuid),
  };
};
