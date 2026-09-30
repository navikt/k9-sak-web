import { queryOptions } from '@tanstack/react-query';
import { useDelingAvDagerApi } from './DelingAvDagerApiContext.js';

export const useRammevedtakOptions = (behandlingUuid: string) => {
  const api = useDelingAvDagerApi();
  return queryOptions({
    queryKey: ['delingAvDager', 'rammevedtak', behandlingUuid],
    queryFn: () => api.hentRammevedtak(behandlingUuid),
  });
};
