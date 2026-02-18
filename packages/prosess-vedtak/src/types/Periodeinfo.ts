import { k9_sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type Periodeinfo = {
  kilde: OverlappendeYtelseDto['kilde'];
  ytelseType: OverlappendeYtelseDto['ytelseType'];
};
