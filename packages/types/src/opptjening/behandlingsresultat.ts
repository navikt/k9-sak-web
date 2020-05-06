import Vilkårresultat from './vilkårresultat';

type Behandlingsresultat = Readonly<{
  vilkårResultat: {
    [name: string]: Vilkårresultat[];
  };
}>;

export default Behandlingsresultat;
