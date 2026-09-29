import { queryOptions } from '@tanstack/react-query';
import type { OmPleietrengendeApi } from './OmPleietrengendeApi.js';

export const omPleietrengendeQueryOptions = (api: OmPleietrengendeApi, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['omPleietrengende', behandlingUuid, api.backend],
    queryFn: () => api.hentPleietrengende(behandlingUuid),
  });
