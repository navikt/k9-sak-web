import type Kodeverk from './kodeverkTsType';

export type FeilutbetalingPeriode = Readonly<{
  fom: string;
  tom: string;
  belop: number;
  foreldelseVurderingType: Kodeverk;
  begrunnelse?: string;
  foreldelsesfrist?: Date;
  oppdagelsesDato?: Date;
}>;

export type FeilutbetalingPerioderWrapper = Readonly<{
  perioder: FeilutbetalingPeriode[];
}>;

export default FeilutbetalingPerioderWrapper;
