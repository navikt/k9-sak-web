import type { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import { ignoreUnusedDeclared } from '@k9-sak-web/gui/storybook/mocks/ignoreUnusedDeclared.js';
import type { UngSakBackendApi } from '../../data/UngSakBackendApi.js';

interface FakeUngSakBackendClientOptions {
  fagsaker?: FagsakDto[];
}

export class FakeUngSakBackendClient implements UngSakBackendApi {
  private options: FakeUngSakBackendClientOptions;

  constructor(options: FakeUngSakBackendClientOptions = {}) {
    this.options = options;
  }

  async fagsakSøk(_searchString: string): Promise<FagsakDto[]> {
    ignoreUnusedDeclared(_searchString);
    return this.options.fagsaker ?? [];
  }
}
