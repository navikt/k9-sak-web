import { queryOptions } from '@tanstack/react-query';
import type { BarnOmsBackendApiType } from './BarnOmsBackendApiType.js';

export const barnOmsQueryOptions = (api: BarnOmsBackendApiType, behandlingUuid: string, behandlingVersjon: number) =>
  queryOptions({
    queryKey: ['barnOms', 'barnOgRammevedtak', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: () => api.hentBarnOgRammevedtak(behandlingUuid),
  });
