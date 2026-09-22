import { queryOptions } from '@tanstack/react-query';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';

export const feilutbetalingFaktaQueryOptions = (api: FeilutbetalingFaktaApi, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['feilutbetaling-fakta', behandlingUuid, api.backend],
    queryFn: () => api.hentFeilutbetalingFakta(behandlingUuid),
  });

export const feilutbetalingÅrsakerQueryOptions = (api: FeilutbetalingFaktaApi) =>
  queryOptions({
    queryKey: ['feilutbetaling-aarsaker', api.backend],
    queryFn: () => api.hentFeilutbetalingÅrsaker(),
  });
