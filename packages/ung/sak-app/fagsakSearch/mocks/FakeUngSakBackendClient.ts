import type { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakYtelseType.js';
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

  async fagsakSøk(_searchString: string, _ytelseType?: FagsakYtelseType): Promise<FagsakDto[]> {
    ignoreUnusedDeclared(_searchString);
    ignoreUnusedDeclared(_ytelseType);
    return this.options.fagsaker ?? [];
  }
}
