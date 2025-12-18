import {
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  type k9_sak_kontrakt_fagsak_FagsakDto,
  type k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';

export interface K9SakProsessApi {
  getAksjonspunkter(behandlingUuid: string): Promise<k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]>;
  getVilkår(behandlingUuid: string): Promise<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[]>;
  getFagsak(saksnummer: string): Promise<k9_sak_kontrakt_fagsak_FagsakDto>;
}
