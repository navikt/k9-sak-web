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
  select?: (data: Awaited<ReturnType<typeof api.getAksjonspunkter>>) => k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
    ...(select && { select }),
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
