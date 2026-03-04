import type { AktørInfoDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/AktørInfoDto.js';

export type Aktørinfo = {
  fagsaker: AktørInfoDto['fagsaker'];
  person: {
    personnummer: string;
    navn: string;
    erKvinne: boolean;
    alder: number;
  };
};
