import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/k9-sak-typescript-client/types';
import { queryOptions } from '@tanstack/react-query';
import { K9SakProsessApi } from './K9SakProsessApi';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const vilkårQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const aksjonspunkterQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  aksjonspunktKoder?: string[],
) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
    select: aksjonspunktKoder
      ? (data: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
          data.filter(ap => aksjonspunktKoder.some(kode => kode === ap.definisjon))
      : undefined,
  });

export const behandlingQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon],
    queryFn: () => api.getBehandling(behandling.uuid),
  });

export const beregningsgrunnlagQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['beregningsgrunnlag', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getAlleBeregningsgrunnlag(behandling.uuid) : null),
  });

export const arbeidsgiverOpplysningerQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['arbeidsgiverOpplysningerPerId', behandling.uuid, behandling.versjon],
    queryFn: () => api.getArbeidsgiverOpplysninger(behandling.uuid),
  });

export const personopplysningerQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['personopplysninger', behandling.uuid, behandling.versjon],
    queryFn: () => api.getPersonopplysninger(behandling.uuid),
  });

export const uttakQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['uttak', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getUttaksplan(behandling.uuid) : null),
  });

export const beregningsresultatUtbetalingQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['beregningsresultatUtbetaling', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getBeregningsresultatMedUtbetaling(behandling.uuid) : null),
  });

export const simuleringResultatQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['simuleringResultat', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getSimuleringResultat(behandling.uuid) : null),
  });

export const tilbakekrevingvalgQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['tilbakekrevingvalg', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getTilbakekrevingValg(behandling.uuid) : null),
  });

export const overlappendeYtelserQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['overlappendeYtelser', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getOverlappendeYtelser(behandling.uuid) : null),
  });

export const beregningreferanserTilVurderingQueryOptions = (
  api: K9SakProsessApi,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['beregningreferanserTilVurdering', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getBeregningreferanserTilVurdering(behandling.uuid) : null),
  });

export const søknadsfristStatusQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['soknadsfristStatus', behandling.uuid, behandling.versjon],
    queryFn: () => api.getSøknadsfristStatus(behandling.uuid),
  });

export const fagsakQueryOptions = (api: K9SakProsessApi, saksnummer: string, behandling: Behandling) =>
  queryOptions({
    queryKey: ['fagsak', saksnummer, behandling.versjon],
    queryFn: () => api.getFagsak(saksnummer),
  });

export const opptjeningQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['opptjening', behandling.uuid, behandling.versjon],
    queryFn: () => api.getOpptjening(behandling.uuid),
  });

export const feriepengegrunnlagQueryOptions = (api: K9SakProsessApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['feriepengegrunnlag', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getFeriepengegrunnlag(behandling.uuid) : null),
    select: data => {
      const result = new Map<number, k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto[]>();
      if (!data) return result;
      for (const andel of data.andeler) {
        const year = andel.opptjeningsår;
        if (!result.has(year)) result.set(year, []);
        result.get(year)!.push(andel);
      }
      return result;
    },
  });
