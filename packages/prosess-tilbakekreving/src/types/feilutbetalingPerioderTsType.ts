export type FeilutbetalingPeriode = Readonly<{
  fom: string;
  tom: string;
  belop: number;
  foreldelseVurderingType: string;
  begrunnelse: string;
}>;

type FeilutbetalingPerioderWrapper = Readonly<{
  perioder: FeilutbetalingPeriode[];
}>;

export default FeilutbetalingPerioderWrapper;
