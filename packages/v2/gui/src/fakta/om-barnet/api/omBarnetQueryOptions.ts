import { queryOptions } from '@tanstack/react-query';
import type { OmBarnetBackendApiType } from './OmBarnetBackendApiType.js';

export const omBarnetQueryOptions = (api: OmBarnetBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['omBarnet', 'rettVedDød', behandlingUuid, api.backend],
    queryFn: () => api.hentRettVedDød(behandlingUuid),
  });
