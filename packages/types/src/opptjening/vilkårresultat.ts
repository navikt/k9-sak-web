import type { Kodeverk } from '@k9-sak-web/types';

export type Vilkårresultat = Readonly<{
  avslagsårsak: Kodeverk;
  periode: {
    fom: string;
    tom: string;
  };
  utfall: Kodeverk;
}>;

export default Vilkårresultat;
