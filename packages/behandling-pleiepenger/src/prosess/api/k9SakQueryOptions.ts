import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/k9-sak-typescript-client/types';
import { queryOptions } from '@tanstack/react-query';
import { K9SakProsessApi } from './K9SakProsessApi';

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

export const beregningsgrunnlagQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['beregningsgrunnlag', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAlleBeregningsgrunnlag(behandling.uuid),
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

export const uttakQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['uttak', behandling.uuid, behandling.versjon],
    queryFn: () => api.getUttaksplan(behandling.uuid),
  });

export const beregningsresultatUtbetalingQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['beregningsresultatUtbetaling', behandling.uuid, behandling.versjon],
    queryFn: () => api.getBeregningsresultatMedUtbetaling(behandling.uuid),
  });

export const simuleringResultatQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['simuleringResultat', behandling.uuid, behandling.versjon],
    queryFn: () => api.getSimuleringResultat(behandling.uuid),
  });

export const tilbakekrevingvalgQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['tilbakekrevingvalg', behandling.uuid, behandling.versjon],
    queryFn: () => api.getTilbakekrevingValg(behandling.uuid),
  });

export const overlappendeYtelserQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['overlappendeYtelser', behandling.uuid, behandling.versjon],
    queryFn: () => api.getOverlappendeYtelser(behandling.uuid),
  });

export const medlemskapQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['medlemskap', behandling.uuid, behandling.versjon],
    queryFn: () => api.getMedlemskap(behandling.uuid),
  });

export const beregningreferanserTilVurderingQueryOptions = (api: K9SakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['beregningreferanserTilVurdering', behandling.uuid, behandling.versjon],
    queryFn: () => api.getBeregningreferanserTilVurdering(behandling.uuid),
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
