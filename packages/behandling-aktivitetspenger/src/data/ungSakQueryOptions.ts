import { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/ung-sak-typescript-client/types';
import { queryOptions } from '@tanstack/react-query';
import { UngSakProsessApi } from './UngSakProsessApi';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const vilkårQueryOptions = (api: UngSakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon],
    queryFn: () => api.getVilkår(behandling.uuid),
  });

export const aksjonspunkterQueryOptions = (
  api: UngSakProsessApi,
  behandling: Behandling,
  aksjonspunktKoder?: string[],
) =>
  queryOptions({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
    select: aksjonspunktKoder
      ? (data: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
          data.filter(ap => aksjonspunktKoder.some(kode => kode === ap.definisjon))
      : undefined,
  });

export const behandlingQueryOptions = (api: UngSakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['behandling', behandling.uuid, behandling.versjon],
    queryFn: () => api.getBehandling(behandling.uuid),
  });

export const fagsakQueryOptions = (api: UngSakProsessApi, saksnummer: string, behandling: Behandling) =>
  queryOptions({
    queryKey: ['fagsak', saksnummer, behandling.versjon],
    queryFn: () => api.getFagsak(saksnummer),
  });

export const personopplysningerQueryOptions = (api: UngSakProsessApi, behandling: Behandling) =>
  queryOptions({
    queryKey: ['personopplysninger', behandling.uuid, behandling.versjon],
    queryFn: () => api.getPersonopplysninger(behandling.uuid),
  });
