import { Kodeverk } from '@k9-sak-web/types';

export type FeilutbetalingPeriode = Readonly<{
  fom: string;
  tom: string;
  belop: number;
  foreldelseVurderingType: Kodeverk;
  begrunnelse: string;
}>;

type FeilutbetalingPerioderWrapper = Readonly<{
  perioder: FeilutbetalingPeriode[];
}>;

export default FeilutbetalingPerioderWrapper;
