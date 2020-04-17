import { Kodeverk } from '@k9-sak-web/types';

type Vilkaarresultat = Readonly<{
  avslagsårsak: Kodeverk;
  periode: {
    fom: string;
    tom: string;
  };
  utfall: Kodeverk;
}>;

export default Vilkaarresultat;
