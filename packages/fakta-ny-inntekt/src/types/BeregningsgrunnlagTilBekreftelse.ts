export type BeregningsgrunnlagTilBekreftelse<T> = T & {
  periode: { fom: string; tom: string };
  begrunnelse?: string;
};
