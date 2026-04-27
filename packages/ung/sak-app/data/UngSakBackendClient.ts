import { fagsak_søkFagsaker, navAnsatt_getSaksbehandlere } from '@navikt/ung-sak-typescript-client/sdk';
import {
  ung_sak_kontrakt_fagsak_FagsakDto,
  ung_sak_kontrakt_saksbehandler_SaksbehandlerDto,
} from '@navikt/ung-sak-typescript-client/types';
import type { UngSakBackendApi } from './UngSakBackendApi.js';

export class UngSakBackendClient implements UngSakBackendApi {
  readonly backend = 'ungsak';
  async fagsakSøk(searchString: string): Promise<Array<ung_sak_kontrakt_fagsak_FagsakDto>> {
    return (await fagsak_søkFagsaker({ body: { searchString } })).data;
  }

  async hentSaksbehandlere(behandlingUuid: string): Promise<ung_sak_kontrakt_saksbehandler_SaksbehandlerDto> {
    return (await navAnsatt_getSaksbehandlere({ query: { behandlingUuid } })).data;
  }
}
