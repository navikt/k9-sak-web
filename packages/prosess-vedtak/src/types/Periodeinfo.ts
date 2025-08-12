import { sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto } from '@navikt/k9-sak-typescript-client';

export type Periodeinfo = {
  kilde: OverlappendeYtelseDto['kilde'];
  ytelseType: OverlappendeYtelseDto['ytelseType'];
};
