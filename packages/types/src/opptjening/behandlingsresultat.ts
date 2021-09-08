import Vilkårresultat from './vilkårresultat';

export type Behandlingsresultat = Readonly<{
  vilkårResultat: {
    [name: string]: Vilkårresultat[];
  };
}>;

export default Behandlingsresultat;
