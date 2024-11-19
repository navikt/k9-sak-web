import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakPerson } from './FagsakPerson';

export type Fagsak = {
  person?: FagsakPerson;
  sakstype: FagsakYtelsesType;
};
