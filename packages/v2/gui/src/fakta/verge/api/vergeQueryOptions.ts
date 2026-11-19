import { queryOptions } from '@tanstack/react-query';
import type { VergeBackendApiType } from './VergeBackendApiType.js';

export const vergeQueryOptions = (api: VergeBackendApiType, behandlingUuid: string, behandlingVersjon: number) =>
  queryOptions({
    queryKey: ['verge', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: () => api.hentVerge(behandlingUuid),
  });
