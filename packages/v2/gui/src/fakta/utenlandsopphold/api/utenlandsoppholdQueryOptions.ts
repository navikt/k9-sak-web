import { queryOptions } from '@tanstack/react-query';
import type { UtenlandsoppholdBackendApiType } from './UtenlandsoppholdBackendApiType.js';

export const utenlandsoppholdQueryOptions = (api: UtenlandsoppholdBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['utenlandsopphold', behandlingUuid, api.backend],
    queryFn: () => api.hentUtenlandsopphold(behandlingUuid),
  });
