import { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { queryOptions } from '@tanstack/react-query';
import { UngSakApi } from './UngSakApi';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const vilkårQueryOptions = (api: UngSakApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const aksjonspunkterQueryOptions = (api: UngSakApi, behandling: Behandling, aksjonspunktKoder?: string[]) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
    select: aksjonspunktKoder
      ? (data: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
          data.filter(ap => aksjonspunktKoder.some(kode => kode === ap.definisjon))
      : undefined,
  });

export const behandlingQueryOptions = (api: UngSakApi, behandling: Pick<Behandling, 'uuid' | 'versjon'>) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon],
    queryFn: () => api.getBehandling(behandling.uuid),
  });

export const beregningsgrunnlagQueryOptions = (api: UngSakApi, behandling: Behandling, enabled = true) =>
  queryOptions({
    queryKey: ['aktivitetspenger-beregningsgrunnlag', behandling.uuid, behandling.versjon, enabled],
    queryFn: () => (enabled ? api.getBeregningsgrunnlag(behandling.uuid) : null),
  });

export const innloggetBrukerQueryOptions = (api: UngSakApi) =>
  queryOptions({
    queryKey: ['innlogget-bruker'],
    queryFn: () => api.getInnloggetBruker(),
  });
