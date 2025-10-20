import { Kodeverk } from '@k9-sak-web/types';

type ForeldelsePerioder = Readonly<{
  fom: string;
  tom: string;
  belop: number;
  foreldelseVurderingType: Kodeverk;
  begrunnelse: string;
}>;

type ForeldelsePerioderWrapper = Readonly<{
  perioder: ForeldelsePerioder[];
}>;

export default ForeldelsePerioderWrapper;
