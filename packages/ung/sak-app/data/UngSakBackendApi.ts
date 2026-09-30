import { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import { ung_sak_kontrakt_saksbehandler_SaksbehandlerDto } from '@navikt/ung-sak-typescript-client/types';

export interface UngSakBackendApi extends BackendTilhørighet {
  fagsakSøk(searchString: string): Promise<Array<FagsakDto>>;
  hentSaksbehandlere(behandlingUuid: string): Promise<ung_sak_kontrakt_saksbehandler_SaksbehandlerDto>;
}
