export type BeregningResultatPeriode = {
  periode: {
    fom: string;
    tom: string;
  };
  vurdering: string;
  feilutbetaltBeløp: number;
  andelAvBeløp: number;
  renterProsent: number;
  manueltSattTilbakekrevingsbeløp: number;
  tilbakekrevingBeløpUtenRenter: number;
  renteBeløp: number;
  tilbakekrevingBeløp: number;
  skattBeløp: number;
  tilbakekrevingBeløpEtterSkatt: number;
  utbetaltYtelseBeløp: number;
  riktigYtelseBeløp: number;
};

type BeregningsresultatTilbakekreving = {
  beregningResultatPerioder: BeregningResultatPeriode[];
  vedtakResultatType: string;
};

export default BeregningsresultatTilbakekreving;
