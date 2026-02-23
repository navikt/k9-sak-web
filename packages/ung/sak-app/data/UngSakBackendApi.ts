import { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import { FagsakYtelseType } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakYtelseType.js';

export interface UngSakBackendApi {
  fagsakSøk(searchString: string, ytelseType?: FagsakYtelseType): Promise<Array<FagsakDto>>;
}
