import { queryOptions } from '@tanstack/react-query';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export const omPleietrengendeQueryOptions = (api: OmPleietrengendeBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['omPleietrengende', behandlingUuid, api.backend],
    queryFn: () => api.hentPleietrengende(behandlingUuid),
  });
