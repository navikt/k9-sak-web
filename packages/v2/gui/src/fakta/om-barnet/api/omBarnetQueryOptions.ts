import { queryOptions } from '@tanstack/react-query';
import type { OmBarnetBackendApiType } from './OmBarnetBackendApiType.js';

export const omBarnetQueryOptions = (api: OmBarnetBackendApiType, behandlingUuid: string, behandlingVersjon: number) =>
  queryOptions({
    queryKey: ['omBarnet', 'rettVedDød', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: () => api.hentRettVedDød(behandlingUuid),
  });
