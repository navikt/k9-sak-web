import type { AktørInfoDto } from '@k9-sak-web/backend/k9sak/generated';

export type Aktørinfo = {
  fagsaker: AktørInfoDto['fagsaker'];
  person: {
    personnummer: string;
    navn: string;
    erKvinne: boolean;
    alder: number;
  };
};
