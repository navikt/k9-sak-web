import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { AsyncPollingStatusStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { queryOptions } from '@tanstack/react-query';
import { TimeoutError } from '../../app/errorhandling/legacycompat/TimeoutError.js';
import { delay } from '../../utils/delay.js';
import type { AktivitetspengerApi } from './AktivitetspengerApi.js';

interface Behandling {
  uuid: string;
  versjon: number;
}

const MAX_POLL_ATTEMPTS = 150;

// Backend kan ha en pågående prosess som endrer behandlingsversjonen etter at behandlingen er hentet.
// Returnerer behandlingen hvis backend sendte den med når prosessen var ferdig.
export const ventTilBehandlingErKlar = async (
  api: AktivitetspengerApi,
  behandlingUuid: string,
  signal: AbortSignal,
): Promise<BehandlingDto | undefined> => {
  for (let attempts = 0; attempts < MAX_POLL_ATTEMPTS; attempts++) {
    let response;
    try {
      response = await api.hentBehandlingMidlertidigStatus(behandlingUuid, signal);
    } catch (error) {
      // Som i RequestRunner: ved HALTED/DELAYED hentes behandlingen likevel, og feilen meldes til bruker.
      const pollingStatus = error instanceof ExtendedApiError ? error.pollingStatus?.status : undefined;
      if (pollingStatus === AsyncPollingStatusStatus.HALTED || pollingStatus === AsyncPollingStatusStatus.DELAYED) {
        void Promise.reject(error);
        return undefined;
      }
      throw error;
    }
    if ('behandling' in response) return response.behandling;
    if (response.status?.status !== AsyncPollingStatusStatus.PENDING) return undefined;
    await delay(response.status.pollIntervalMillis ?? 500, signal);
  }
  throw new TimeoutError(`behandling/status?behandlingUuid=${behandlingUuid}`);
};

export const vilkårQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const vilkårsavklaringerQueryOptions = (
  api: AktivitetspengerApi,
  behandling: Behandling,
  vilkarType: VilkårType,
) =>
  queryOptions({
    queryKey: ['vilkårsavklaringer', behandling.uuid, behandling.versjon, vilkarType, api.backend],
    queryFn: () => api.hentVilkårsavklaringer(behandling.uuid, vilkarType),
  });

export const vilkårsavklaringVurderingerQueryOptions = (
  api: AktivitetspengerApi,
  behandling: Behandling,
  vilkarType: VilkårType,
) =>
  queryOptions<VilkårsavklaringVurderingerDto>({
    queryKey: ['vilkårsavklaring-vurderinger', behandling.uuid, behandling.versjon, vilkarType, api.backend],
    queryFn: () => api.hentVilkårsavklaringVurderinger(behandling.uuid, vilkarType),
  });

export const aksjonspunkterQueryOptions = (api: AktivitetspengerApi, behandling?: Behandling) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling?.uuid, behandling?.versjon, api.backend],
    queryFn: () => api.getAksjonspunkter(behandling!.uuid),
    enabled: !!behandling,
  });

export const behandlingQueryOptions = (api: AktivitetspengerApi, behandling: Pick<Behandling, 'uuid' | 'versjon'>) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon, api.backend],
    queryFn: async ({ signal }) =>
      (await ventTilBehandlingErKlar(api, behandling.uuid, signal)) ?? api.getBehandling(behandling.uuid),
    // Hindrer ny henting rett etter at usePollBehandlingStatus har fylt cache for ny versjon
    staleTime: 5_000,
    // Pollgrensen skal begrense antall kall mot backend, så den skal ikke multipliseres av retries
    retry: (failureCount, error) => !(error instanceof TimeoutError) && failureCount < 3,
  });

export const beregningsgrunnlagQueryOptions = (api: AktivitetspengerApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['aktivitetspenger-beregningsgrunnlag', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getBeregningsgrunnlag(behandling.uuid) : null),
  });

export const innloggetBrukerQueryOptions = (api: AktivitetspengerApi) =>
  queryOptions({
    queryKey: ['innlogget-bruker', api.backend],
    queryFn: () => api.getInnloggetBruker(),
  });

export const satsOgUtbetalingPerioderQueryOptions = (
  api: AktivitetspengerApi,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['satsOgUtbetalingPerioder', behandling.uuid, behandling.versjon, api.backend, enabled],
    queryFn: () => (enabled ? api.getSatsOgUtbetalingPerioder(behandling.uuid) : null),
  });

export const kontrollerInntektQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['aktivitetspenger-kontrollInntekt', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getKontrollerInntekt(behandling.uuid),
  });

export const totrinnskontrollSkjermlenkeContextQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['totrinnskontroll-skjermlenke-context', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentTotrinnskontrollSkjermlenkeContext(behandling.uuid),
  });

export const lovligeBehandlingsoperasjonerQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['lovlige-behandlingsoperasjoner', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentLovligeBehandlingsoperasjoner(behandling.uuid),
  });

export const bostedGrunnlagQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['bosted-grunnlag', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentBostedGrunnlag(behandling.uuid),
  });

export const perioderSomKanAvkortesQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['perioder-som-kan-avkortes', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentPerioderSomKanAvkortes(behandling.uuid),
  });

export const andreLivsoppholdsytelserVurderingerQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['andre-livsoppholdsytelser-vurderinger', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentAndreLivsoppholdsytelserVurderinger(behandling.uuid),
  });

export const simuleringResultatQueryOptions = (api: AktivitetspengerApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['simuleringResultat', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getSimuleringResultat(behandling.uuid) : null),
  });

export const tilbakekrevingvalgQueryOptions = (api: AktivitetspengerApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['tilbakekrevingvalg', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getTilbakekrevingValg(behandling.uuid) : null),
  });

export const fagsakQueryOptions = (api: AktivitetspengerApi, saksnummer: string) =>
  queryOptions({
    queryKey: ['fagsak', saksnummer, api.backend],
    queryFn: () => api.getFagsak(saksnummer),
  });
