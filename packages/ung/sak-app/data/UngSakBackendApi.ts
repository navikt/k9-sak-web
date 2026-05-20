import { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import { ung_sak_kontrakt_saksbehandler_SaksbehandlerDto } from '@navikt/ung-sak-typescript-client/types';

export interface UngSakBackendApi {
  readonly backend: 'ungsak';
  fagsakSøk(searchString: string): Promise<Array<FagsakDto>>;
  hentSaksbehandlere(behandlingUuid: string): Promise<ung_sak_kontrakt_saksbehandler_SaksbehandlerDto>;
}
