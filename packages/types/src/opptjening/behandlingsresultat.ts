import Vilkaarresultat from './vilkaarresultat';

type Behandlingsresultat = Readonly<{
  vilkårResultat: {
    [name: string]: Vilkaarresultat[];
  };
}>;

export default Behandlingsresultat;
