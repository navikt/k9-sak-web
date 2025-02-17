import { type BeregningsgrunnlagTilBekreftelse } from './BeregningsgrunnlagTilBekreftelse.js';

export type BeregningAvklaringsbehovTilBekreftelse<T, V> = {
  kode: T;
  begrunnelse?: string;
  grunnlag: BeregningsgrunnlagTilBekreftelse<V>[];
};
