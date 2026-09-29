import { useOmsorgenForApi } from './OmsorgenForApiContext.js';

export const useOmsorgenForOptions = (behandlingUuid: string, behandlingVersjon: number) => {
  const api = useOmsorgenForApi();
  return {
    queryKey: ['omsorgsperiodeoversikt', behandlingUuid, behandlingVersjon],
    queryFn: () => api.getOmsorgsperioder(behandlingUuid),
  };
};
