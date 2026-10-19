import { queryOptions } from '@tanstack/react-query';
import { useOmsorgenForApi } from './OmsorgenForApiContext.js';

export const useOmsorgenForOptions = (behandlingUuid: string, behandlingVersjon: number) => {
  const api = useOmsorgenForApi();
  return queryOptions({
    queryKey: ['omsorgsperiodeoversikt', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: () => api.getOmsorgsperioder(behandlingUuid),
  });
};
