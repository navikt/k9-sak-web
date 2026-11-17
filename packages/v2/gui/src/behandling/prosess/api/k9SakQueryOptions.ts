import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { queryOptions } from '@tanstack/react-query';
import type { K9SakProsessApi } from './K9SakProsessApi.js';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const vilkårQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const aksjonspunkterQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  aksjonspunktKoder?: string[],
) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
    select: aksjonspunktKoder
      ? (data: AksjonspunktDto[]) => data.filter(ap => aksjonspunktKoder.some(kode => kode === ap.definisjon))
      : undefined,
  });

export const behandlingQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getBehandling(behandling.uuid),
  });

export const medlemskapQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['medlemskap', behandling.uuid, behandling.versjon],
    queryFn: () => api.getMedlemskap(behandling.uuid),
  });

export const beregningsgrunnlagQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['beregningsgrunnlag', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getAlleBeregningsgrunnlag(behandling.uuid) : null),
  });

export const arbeidsgiverOpplysningerQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['arbeidsgiverOpplysningerPerId', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getArbeidsgiverOpplysninger(behandling.uuid),
  });

export const personopplysningerQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['personopplysninger', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getPersonopplysninger(behandling.uuid),
  });

export const beregningsresultatUtbetalingQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['beregningsresultatUtbetaling', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getBeregningsresultatMedUtbetaling(behandling.uuid) : null),
  });

export const simuleringResultatQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['simuleringResultat', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getSimuleringResultat(behandling.uuid) : null),
  });

export const tilbakekrevingvalgQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['tilbakekrevingvalg', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getTilbakekrevingValg(behandling.uuid) : null),
  });

export const overlappendeYtelserQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['overlappendeYtelser', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getOverlappendeYtelser(behandling.uuid) : null),
  });

export const beregningreferanserTilVurderingQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['beregningreferanserTilVurdering', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.getBeregningreferanserTilVurdering(behandling.uuid) : null),
  });

export const søknadsfristStatusQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['soknadsfristStatus', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getSøknadsfristStatus(behandling.uuid),
  });

export const fagsakQueryOptions = (api: K9SakProsessApi, saksnummer: string, behandling: Behandling) =>
  queryOptions({
    queryKey: ['fagsak', saksnummer, behandling.versjon, api.backend],
    queryFn: () => api.getFagsak(saksnummer),
  });

export const opptjeningQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['opptjening', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.getOpptjening(behandling.uuid),
  });

export const forbrukteDagerQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['forbrukteDager', behandling.uuid, behandling.versjon],
    queryFn: () => api.getForbrukteDager(behandling.uuid),
  });
