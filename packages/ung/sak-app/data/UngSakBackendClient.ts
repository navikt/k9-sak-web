import { fagsak_søkFagsaker } from '@navikt/ung-sak-typescript-client/sdk';
import { ung_sak_kontrakt_fagsak_FagsakDto } from '@navikt/ung-sak-typescript-client/types';
import type { UngSakBackendApi } from './UngSakBackendApi.js';

export class UngSakBackendClient implements UngSakBackendApi {
  async fagsakSøk(searchString: string): Promise<Array<ung_sak_kontrakt_fagsak_FagsakDto>> {
    return (await fagsak_søkFagsaker({ body: { searchString } })).data;
  }
}
