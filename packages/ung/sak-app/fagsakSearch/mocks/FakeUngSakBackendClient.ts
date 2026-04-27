import type { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import { ignoreUnusedDeclared } from '@k9-sak-web/gui/storybook/mocks/ignoreUnusedDeclared.js';
import { ung_sak_kontrakt_saksbehandler_SaksbehandlerDto } from '@navikt/ung-sak-typescript-client/types';
import type { UngSakBackendApi } from '../../data/UngSakBackendApi.js';

interface FakeUngSakBackendClientOptions {
  fagsaker?: FagsakDto[];
}

export class FakeUngSakBackendClient implements UngSakBackendApi {
  readonly backend = 'ungsak';
  private options: FakeUngSakBackendClientOptions;

  constructor(options: FakeUngSakBackendClientOptions = {}) {
    this.options = options;
  }

  async fagsakSøk(_searchString: string): Promise<FagsakDto[]> {
    ignoreUnusedDeclared(_searchString);
    return this.options.fagsaker ?? [];
  }

  async hentSaksbehandlere(_behandlingUuid: string): Promise<ung_sak_kontrakt_saksbehandler_SaksbehandlerDto> {
    ignoreUnusedDeclared(_behandlingUuid);
    return {
      saksbehandlere: {},
    };
  }
}
