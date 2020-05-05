import { Kodeverk } from '@k9-sak-web/types';

type Vilkårresultat = Readonly<{
  avslagsårsak: Kodeverk;
  periode: {
    fom: string;
    tom: string;
  };
  utfall: Kodeverk;
}>;

export default Vilkårresultat;
