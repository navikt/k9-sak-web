import { Vurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/inntektsmelding/Vurdering.js';
import { ignore404Errors } from '@k9-sak-web/gui/app/errorhandling/ignore404Errors.js';
import { queryOptions } from '@tanstack/react-query';
import type { DokumenterApi } from './DokumenterApi.js';

export const inntektsmeldingerIBrukQueryOptions = (
  api: DokumenterApi | null,
  behandlingUuid: string,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ['kompletthet', behandlingUuid],
    queryFn: ({ signal }) => {
      if (!api) {
        throw new Error('DokumenterApiContext not provided');
      }
      return api
        .hentVurderingerAvMottatteInntektsmeldinger(behandlingUuid, signal)
        .then(({ vurderinger }) =>
          vurderinger.flatMap(vurderingPåPeriode =>
            vurderingPåPeriode.vurderinger.filter(vurdering => vurdering.vurdering === Vurdering.I_BRUK),
          ),
        );
    },
    enabled: enabled && !!behandlingUuid && !!api,
    throwOnError: ignore404Errors, // k9-sak kaster 404 på dette kallet av og til. Uvisst når pr no
  });
