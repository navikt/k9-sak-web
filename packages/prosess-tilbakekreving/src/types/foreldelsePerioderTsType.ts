import { Kodeverk } from '@k9-sak-web/types';

export type ForeldelsePerioder = Readonly<{
  fom: string;
  tom: string;
  belop: number;
  foreldelseVurderingType: string;
  begrunnelse: string;
}>;

type ForeldelsePerioderWrapper = Readonly<{
  perioder: ForeldelsePerioder[];
}>;

export default ForeldelsePerioderWrapper;
