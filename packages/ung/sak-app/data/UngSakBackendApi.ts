import { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';

export interface UngSakBackendApi {
  fagsakSøk(searchString: string): Promise<Array<FagsakDto>>;
}
