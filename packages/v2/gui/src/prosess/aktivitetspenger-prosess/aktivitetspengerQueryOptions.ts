import { queryOptions } from '@tanstack/react-query';
import type { AktivitetspengerApi } from './AktivitetspengerApi';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const vilkårQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const aksjonspunkterQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
  });

export const behandlingQueryOptions = (api: AktivitetspengerApi, behandling: Pick<Behandling, 'uuid' | 'versjon'>) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getBehandling(behandling.uuid),
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
    queryKey: ['satsOgUtbetalingPerioder', behandling.uuid, api.backend, enabled],
    queryFn: () => (enabled ? api.getSatsOgUtbetalingPerioder(behandling.uuid) : null),
  });

export const totrinnskontrollSkjermlenkeContextQueryOptions = (api: AktivitetspengerApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['totrinnskontroll-skjermlenke-context', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.hentTotrinnskontrollSkjermlenkeContext(behandling.uuid),
  });
