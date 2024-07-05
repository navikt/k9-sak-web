import type { FagsakDto } from '../../generated';

export type FagsakStatus = Exclude<FagsakDto['status'], undefined>;

// enum navn i java kode skiller seg tydleg frå kode verdi, reimplementerer navna her for å gjere koding enklare.
type FagsakStatusName = 'OPPRETTET' | 'UNDER_BEHANDLING' | 'LØPENDE' | 'AVSLUTTET';

export const fagsakStatus: Readonly<Record<FagsakStatusName, FagsakStatus>> = {
  LØPENDE: 'LOP',
  AVSLUTTET: 'AVSLU',
  OPPRETTET: 'OPPR',
  UNDER_BEHANDLING: 'UBEH',
};
