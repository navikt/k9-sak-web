import { queryOptions } from '@tanstack/react-query';
import type { AntallDagerLivetsSluttfaseBackendApiType } from './AntallDagerLivetsSluttfaseBackendApiType.js';

export const antallDagerLivetsSluttfaseQueryOptions = (
  api: AntallDagerLivetsSluttfaseBackendApiType,
  behandlingUuid: string,
  behandlingVersjon: number,
) =>
  queryOptions({
    queryKey: ['antallDagerLivetsSluttfase', behandlingUuid, behandlingVersjon, api.backend],
    queryFn: () => api.hentKvoteInfo(behandlingUuid),
  });
