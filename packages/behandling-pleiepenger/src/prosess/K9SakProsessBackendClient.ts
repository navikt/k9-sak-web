import {
  aksjonspunkt_getAksjonspunkter1,
  behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder,
  fagsak_hentFagsak,
  vilkår_getVilkårV3,
} from '@navikt/k9-sak-typescript-client/sdk';
import { K9SakProsessApi } from './K9SakProsessApi';

export class K9SakProsessBackendClient implements K9SakProsessApi {
  async getAksjonspunkter(behandlingUuid: string) {
    return (await aksjonspunkt_getAksjonspunkter1({ query: { behandlingUuid } })).data;
  }

  async getVilkår(behandlingUuid: string) {
    return (await vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }

  async getFagsak(saksnummer: string) {
    return (await fagsak_hentFagsak({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getUttaksplan(behandlingUuid: string) {
    return (await behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  }
}
