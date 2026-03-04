import type { OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/ytelser/OverlappendeYtelseDto.js';

export type Periodeinfo = {
  kilde: OverlappendeYtelseDto['kilde'];
  ytelseType: OverlappendeYtelseDto['ytelseType'];
};
