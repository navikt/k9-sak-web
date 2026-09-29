import { queryOptions } from '@tanstack/react-query';
import type { UtenlandsoppholdApi } from './UtenlandsoppholdApi.js';

export const utenlandsoppholdQueryOptions = (api: UtenlandsoppholdApi, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['utenlandsopphold', behandlingUuid, api.backend],
    queryFn: () => api.hentUtenlandsopphold(behandlingUuid),
  });
